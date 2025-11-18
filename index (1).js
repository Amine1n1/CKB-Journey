import * as bindings from '@ckb-js-std/bindings';
import { Script, HighLevel, log } from '@ckb-js-std/core';

function main() {
  

  /*const groupInputs = bindings.countCells(bindings.SOURCE_GROUP_INPUT);
  const groupOutputs = bindings.countCells(bindings.SOURCE_GROUP_OUTPUT);


  if (groupInputs !== 1 || groupOutputs !== 1) {
    return -1;
  }*/

  let inputData = bindings.loadCellData(0, bindings.SOURCE_GROUP_INPUT);
  let outputData = bindings.loadCellData(0, bindings.SOURCE_GROUP_OUTPUT);

  const buffer1 = new Uint8Array(inputData);
  const buffer2 = new Uint8Array(outputData);

  const inputStr = bytesToString(buffer1);
  const outputStr = bytesToString(buffer2);

  const inputValue = parseInt(inputStr);
  const outputValue = parseInt(outputStr);
  

  if (outputValue === inputValue + 1){
    return 0;
  } else {
    return -1;
  }
  
}

bindings.exit(main());

function bytesToString(bytes) {
  let str = "";
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return str;
}