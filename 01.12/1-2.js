'use strict';

const fs = require('fs');
const readline = require('readline');

const numbersMap = {
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9'
};

const numberNotations = [
  ...Object.keys(numbersMap),
  ...Object.values(numbersMap)
];

async function getCompleteCalibrationValue() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const calibrationValues = [];

  for await (const line of rl) {
    // object structure: [index of found number]:number itself
    const foundNumbersByIndexes = {};

    // parsing all possible number notations
    numberNotations.forEach(number => {
      const regex = RegExp(number, 'g');
      let match;

      // searching for all number's appearances and putting start indexes + value to dictionary
      while ((match = regex.exec(line)) !== null) {
        foundNumbersByIndexes[match.index] = numbersMap[number] ? numbersMap[number] : String(number);
      }
    });

    // ordering an object (not the best solution but it works :D)
    const orderedFoundNumbers = Object.keys(foundNumbersByIndexes).sort().reduce(
      (object, key) => {
        object[key] = foundNumbersByIndexes[key];
        return object;
        },
      {}
    );

    const numbersInSequence = Object.values(orderedFoundNumbers);
    const calibrationValue = Number(numbersInSequence[0]) * 10 + Number(numbersInSequence[numbersInSequence.length - 1]);
    calibrationValues.push(calibrationValue);
  }

  // calculating the complete value
  const valuesSum = calibrationValues.reduce((sum, calibrationValue) => sum + calibrationValue, 0);
  console.log(valuesSum);
}

getCompleteCalibrationValue();
