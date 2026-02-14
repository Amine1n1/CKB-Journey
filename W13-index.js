import * as bindings from '@ckb-js-std/bindings';
import { Script, HighLevel, log } from '@ckb-js-std/core';

function main() {

 let countInput = 0;
 let countOutput = 0;

 while (true) {
  try {
    bindings.loadCell(countInput, bindings.SOURCE_GROUP_INPUT);
    countInput++;
  } catch (e) {
    break;
  }
 }

 while (true) {
  try {
    bindings.loadCell(countOutput, bindings.SOURCE_GROUP_OUTPUT);
    countOutput++;
  } catch (e) {
    break;
  }
 }

console.log(countInput);
console.log(countOutput);

 if (countInput === 0) {
  const outputData = bindings.loadCellData(0, bindings.SOURCE_GROUP_OUTPUT);
  const buffer2 = new Uint8Array(outputData);
  const outputStr = bytesToString(buffer2);
  const outputValue = parseInt(outputStr);
  if (outputValue !== 0){
    return -1;
  }
  return 0;
 }


 if (countInput !== 1 || countOutput !== 1) {
  return -1;
 }
  

  const inputData = bindings.loadCellData(0, bindings.SOURCE_GROUP_INPUT);
  
  const buffer1 = new Uint8Array(inputData);
  const inputStr = bytesToString(buffer1);
  const inputValue = parseInt(inputStr);
  
  
  const outputData = bindings.loadCellData(0, bindings.SOURCE_GROUP_OUTPUT);

  const buffer2 = new Uint8Array(outputData);
  const outputStr = bytesToString(buffer2);
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
