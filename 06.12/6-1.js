'use strict';

const fs = require('fs');
const readline = require('readline');

async function getWinningWays() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let times = [];
  let distances = [];

  const successfulAttempts = [];

  for await (const line of rl) {
    const numbers = line.match(/\d+/g).map(e => Number(e));
    if (line.includes('Time:')) {
      times = numbers;
    } else {
      distances = numbers;
    }
  }

  times.forEach((time, index) => {
    successfulAttempts[index] = 0;
    for (let i = 0; i < time; i++) {
      const possibleDistance = (time - i) * i;
      if (possibleDistance > distances[index]) {
        successfulAttempts[index]++;
      }
    }
  });

  const ration = successfulAttempts.reduce((sum, calibrationValue) => sum * calibrationValue, 1);
  console.log(ration);
}

getWinningWays();
