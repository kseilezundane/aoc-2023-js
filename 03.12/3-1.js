'use strict';

const fs = require('fs');
const readline = require('readline');

async function getPartNumberSum() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const lines = []; // cache storing the input
  let numbersInLines = []; // array storing each found number with its' start and end indexes
  let partNumbersSum = 0;

  let X = 0; // impossible to retrieve index of async reading so I'm making it myself :D
  for await (const line of rl) {
    lines.push(line);
    numbersInLines[X] = [];

    const regexp = /(\d+)/g; // finding all numbers
    let match;

    while ((match = regexp.exec(line)) !== null) {
      // pushing all the found numbers in X line to the array of numbers
      numbersInLines[X].push({
        number: Number(match[0]),
        start: match.index,
        end: regexp.lastIndex
      });
    }

    X++;
  }

  // parsing all chars around (and including the numbers)
  // looking for NaN chars that are not dots
  numbersInLines.forEach((line, index) => {
    line.forEach(({ number, start, end }) => {
      let isPartNumber = false;

      const startRow = index > 0 ? index - 1 : index;
      const endRow = index < numbersInLines.length - 1 ? index + 2 : index + 1;

      const startChar = start > 0 ? start - 1 : start;
      const endChar = end < lines[0].length - 1 ? end + 1 : end;

      for (let j = startRow; j < endRow; j++) {
        for (let i = startChar; i < endChar; i++) {
          if (lines[j][i] && lines[j][i] !== '.' && isNaN(lines[j][i])) {
              isPartNumber = true;
          }
        }
      }

      if (isPartNumber) {
        partNumbersSum = partNumbersSum + number;
      }
    });
  });

  console.log(partNumbersSum);
}

getPartNumberSum();
