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
  const gears = {}; // storing all gears and numbers that it attaches to
  let gearRatiosSum = 0;

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
  // if * (gear) found - it's placed to the array of gears with numbers it's been attached to
  numbersInLines.forEach((line, index) => {
    line.forEach(number => {
      let startRow = index > 0 ? index - 1 : index;
      let endRow = index < numbersInLines.length - 1 ? index + 2 : index + 1;

      let startChar = number.start > 0 ? number.start - 1 : number.start;
      let endChar = number.end < lines[0].length - 1 ? number.end + 1 : number.end;

      for (let j = startRow; j < endRow; j++) {
        for (let i = startChar; i < endChar; i++) {
          if (lines[j][i] === '*') {
              if (!gears[`${String(j + 1)},${String(i + 1)}`]) {
                gears[`${String(j + 1)},${String(i + 1)}`] = [];
              }
              gears[`${String(j + 1)},${String(i + 1)}`].push(number.number);
          }
        }
      }
    });
  });

  // searching for all gears that attaches only to 2 numbers
  for (const gear in gears) {
    if (gears[gear].length === 2) {
      const gearRatio = gears[gear][0] * gears[gear][1];
      gearRatiosSum = gearRatiosSum + gearRatio;
    }
  }

  console.log(gearRatiosSum);
}

getPartNumberSum();
