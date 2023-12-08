'use strict';

const fs = require('fs');
const readline = require('readline');

async function getWinningWays() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let time;
  let distance;

  let successfulAttempts = 0;

  for await (const line of rl) {
    const numbers = Number(line.match(/\d+/g).join(''));
    if (line.includes('Time:')) {
      time = numbers;
    } else {
      distance = numbers;
    }
  }

    for (let i = 0; i < time; i++) {
      const possibleDistance = (time - i) * i;
      if (possibleDistance > distance) {
        successfulAttempts++;
      }
    }

  console.log(successfulAttempts);
}

getWinningWays();
