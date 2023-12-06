'use strict';

const fs = require('fs');
const readline = require('readline');

async function getLowestLocationNumber() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const seeds = [];

  let from = 'seed';
  let to = 'soil';
  for await (const line of rl) {
    // assigning the seeds
    if (line.includes('seeds:')) {
      const inputSeeds = line.match(/\d+/g);
      inputSeeds.forEach(seed => {
        seeds.push({
          seed: Number(seed),
          soil: -1,
          fertilizer: -1,
          water: -1,
          light: -1,
          temperature: -1,
          humidity: -1,
          location: -1
        });
      });
      continue;
    }

    if (line === '') {
      // assigning seeds not in range after all map is parsed
      seeds.forEach(seed => {
        if (seed[to] === -1) {
          seed[to] = seed[from];
        }
      });
      continue;
    }

    // finds out which convertion will be next
    const mapName = /(\w*)-to-(\w*)/g;
    const newMapFound = line.match(mapName);
    if (newMapFound) {
      const conversions = newMapFound[0].split('-to-');
      from = conversions[0];
      to = conversions[1];
      continue;
    }

    // finding translation trios
    const numberRegexp = /\d+/g;
    const numbers = line.match(numberRegexp).map(e => Number(e));
    if (numbers) {
      seeds.forEach(seed => {
        if (seed[from] >= numbers[1] && seed[from] <= numbers[1] + numbers[2] - 1) {
          seed[to] = numbers[0] + (seed[from] - numbers[1]);
        }
      });
    }
  }

  // assigning location for seeds not in range after all file is parsed
  seeds.forEach(seed => {
    if (seed[to] === -1) {
      seed[to] = seed[from];
    }
  });

  const seedLocations = seeds.map(seed => seed[to]);
  console.log(Math.min(...seedLocations));
}

getLowestLocationNumber();
