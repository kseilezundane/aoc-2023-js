'use strict';

const fs = require('fs');
const readline = require('readline');

const maxCubesAmount = {
  'blue': 14,
  'green': 13,
  'red': 12
}

async function getPossibleGames() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let gameIdSum = 0;

  for await (const line of rl) {
    // boolean that indicates whether cube limit is exceeded
    let isPossibleCombo = true;

    Object.keys(maxCubesAmount).forEach(color => {
      // getting all cubes of this color and finding a max value taken at one attempt
      const regexp = new RegExp(`\\d+(?= ${color})`, 'g');
      const amountOfColoredCubes = [...line.matchAll(regexp)].map((x) => Number(x));
      const maxAmount = Math.max(...amountOfColoredCubes);
      if (maxCubesAmount[color] < maxAmount) {
        isPossibleCombo = false;
      }
    });

    // retrieving game ID
    if (isPossibleCombo) {
      const regex = /(?<=Game )(\d+)/g;
      const found = line.match(regex);
      gameIdSum = gameIdSum + Number(found[0])
    }
  }

  console.log(gameIdSum);
}

getPossibleGames();
