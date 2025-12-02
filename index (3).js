import * as bindings from '@ckb-js-std/bindings';
import { Script, HighLevel, log } from '@ckb-js-std/core';

function main() {
  
  let outputData1 = bindings.loadCellData(0, bindings.SOURCE_GROUP_OUTPUT);
  let outputData2 = bindings.loadCellData(1, bindings.SOURCE_GROUP_OUTPUT);
  let outputData3 = bindings.loadCellData(2, bindings.SOURCE_GROUP_OUTPUT);

  const buffer1 = new Uint8Array(outputData1);
  const buffer2 = new Uint8Array(outputData2);
  const buffer3 = new Uint8Array(outputData3);

  const outputValue1 = bytesToString(buffer1);
  const outputValue2 = bytesToString(buffer2);
  const outputValue3 = bytesToString(buffer3);

  if (outputValue1 === 'my' && outputValue2 === 'first' && outputValue3 === 'contract'){
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