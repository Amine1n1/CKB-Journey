const { ccc, connect, hashTypeToBytes, privateKeyToScript, scriptToAddress } = require("@ckb-ccc/core");
const scripts = require("../deployment/scripts.json");
const systemScripts = require("../deployment/system-scripts.json");
const { buildClient, buildSigner } = require("./helper");


describe("my-first-contract contract", () => {
  const client = buildClient("testnet");
  const signer = buildSigner(client);

  const data1 = '0x6d79';
  const data2 = '0x6669727374';
  const data3 = '0x636f6e7472616374';

  test("should execute successfully", async () => {
    const ckbJsVmScript = systemScripts.testnet["ckb_js_vm"];
    const contractScript = scripts.testnet["my-first-contract.bc"];

    const mainScript = {
      codeHash: ckbJsVmScript.script.codeHash,
      hashType: ckbJsVmScript.script.hashType,
      args: ccc.hexFrom(
        "0x0000" +
          contractScript.codeHash.slice(2) +
          ccc.hexFrom(hashTypeToBytes(contractScript.hashType)).slice(2) +
          "0000000000000000000000000000000000000000000000000000000000000000"
      ),
    };

   
    const signerLock = (await signer.getRecommendedAddressObj()).script;

    const amount = 200n * 10n ** 8n;

    const tx = ccc.Transaction.from({
      outputs: [
        { lock: signerLock, capacity: amount, type: mainScript},
        { lock: signerLock, capacity: amount, type: mainScript},
        { lock: signerLock, capacity: amount, type: mainScript},
      ],
      outputsData: [
        ccc.hexFrom(data1),
        ccc.hexFrom(data2),
        ccc.hexFrom(data3)
      ],
      cellDeps: [
        ...ckbJsVmScript.script.cellDeps.map(c => c.cellDep),
        ...contractScript.cellDeps.map(c => c.cellDep),
      ]
    });

    await tx.completeInputsByCapacity(signer);
    await tx.completeFeeBy(signer, 1000n);

    const signedTx = await signer.signTransaction(tx);
    const txHash = await signer.sendTransaction(signedTx);

    console.log("Transaction sent! TX Hash:", txHash);
  });
});
