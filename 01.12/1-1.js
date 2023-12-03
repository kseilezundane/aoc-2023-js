'use strict';

const fs = require('fs');
const readline = require('readline');

async function getCompleteCalibrationValue() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const calibrationValues = [];

  for await (const line of rl) {
    const lineDigits = line.replace(/\D/g,'');
    // JS magic trick since we're getting STRINGified digits out of sequence;
    const calibrationValue = lineDigits[0] + lineDigits[lineDigits.length - 1];
    calibrationValues.push(calibrationValue);
  }

  const valuesSum = calibrationValues.reduce((sum, calibrationValue) => sum + Number(calibrationValue), 0);
  console.log(valuesSum);
}

getCompleteCalibrationValue();
