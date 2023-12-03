'use strict';

const fs = require('fs');
const readline = require('readline');

async function getPossibleGames() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let powerSum = 0;

  for await (const line of rl) {
    const neededCubeAmount = {
      'blue': 0,
      'green': 0,
      'red': 0
    }

    Object.keys(neededCubeAmount).forEach(color => {
      // getting all cubes of this color and finding a max required amount of cubes
      const regexp = new RegExp(`\\d+(?= ${color})`, 'g');
      const amountOfColoredCubes = [...line.matchAll(regexp)].map((x) => Number(x));
      neededCubeAmount[color] = Math.max(...amountOfColoredCubes);
    });

    // multiplying the retrieved max colored cubes
    const gamePower = Object.values(neededCubeAmount).reduce((acc, curr) => acc * curr, 1)
    powerSum = powerSum + gamePower;
  }

  console.log(powerSum);
}

getPossibleGames();
