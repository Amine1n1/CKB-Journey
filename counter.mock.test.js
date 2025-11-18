const { hexFrom, Transaction, hashTypeToBytes } = require('@ckb-ccc/core');
const { readFileSync } = require('fs');
const { Resource, Verifier, DEFAULT_SCRIPT_ALWAYS_SUCCESS, DEFAULT_SCRIPT_CKB_JS_VM } = require('ckb-testtool');

describe('counter contract', () => {
  test('should execute successfully', async () => {
    const resource = Resource.default();
    const tx = Transaction.default();

    const mainScript = resource.deployCell(hexFrom(readFileSync(DEFAULT_SCRIPT_CKB_JS_VM)), tx, false);
    const alwaysSuccessScript = resource.deployCell(hexFrom(readFileSync(DEFAULT_SCRIPT_ALWAYS_SUCCESS)), tx, false);
    const contractScript = resource.deployCell(hexFrom(readFileSync('dist/counter.bc')), tx, false);
    
    mainScript.args = hexFrom(
      '0x0000' +
        contractScript.codeHash.slice(2) +
        hexFrom(hashTypeToBytes(contractScript.hashType)).slice(2) +
        '0000000000000000000000000000000000000000000000000000000000000000',
    );

    // 1 input cell
    const inputCell = resource.mockCell(alwaysSuccessScript, mainScript,'0x31');
    tx.inputs.push(Resource.createCellInput(inputCell));

    // 1 output cells
    tx.outputs.push(Resource.createCellOutput(alwaysSuccessScript, mainScript));
    tx.outputsData.push(hexFrom('0x32'));
  

    const verifier = Verifier.from(resource, tx);
    // if you are using the native ckb-debugger, you can delete the following line.
    verifier.setWasmDebuggerEnabled(true);
    await verifier.verifySuccess(true);
  });
});
