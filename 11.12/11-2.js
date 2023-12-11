'use strict';

const fs = require('fs');
const readline = require('readline');

async function getShortestPathsSum() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let shortestPathsSum = 0;
  // stores X, Y coordinates of galaxies
  const galaxyLocations = [];

  // stores initial galaxy width (X axis) before modifications
  let galaxyWidth = 0;
  // stores information whether any galaxies exist on specified X coordinate before modifications
  const xAxisOfGalaxies = [];
  // galaxy's expansion rate
  const expansionRate = 1000000;

  // counting length of the universe (Y axis)
  let Y = 0;
  for await (const line of rl) {
    // setting the initial galaxy width (X axis)
    if (galaxyWidth === 0) {
      galaxyWidth = line.length;
    }

    // searching for galaxies on the height
    const neighbouringGalaxies = [];
    const galaxySign = '#';

    let galaxyLocation = line.indexOf(galaxySign, 0);
    while(galaxyLocation >= 0) {
      neighbouringGalaxies.push(galaxyLocation);
      galaxyLocation = line.indexOf(galaxySign, galaxyLocation + 1);
    }

    // if no galaxies found - space expands
    // if found - put their coordinates to the array and move forward
    if(neighbouringGalaxies.length === 0) {
      Y += expansionRate;
    } else {
      neighbouringGalaxies.forEach(galaxy => {
        xAxisOfGalaxies[galaxy] = true;
        galaxyLocations.push({
          X: galaxy,
          Y: Y
        });
      });
      Y++;
    }
  }

  // goes through each galaxy and checks whether it is affected by X axis expansion as well
  galaxyLocations.forEach(location => {
    let columnsToExpand = 0;
    for (let i = 0; i < location.X; i++) {
      if (!xAxisOfGalaxies[i]) {
        columnsToExpand++;
      }
    }
    location.X += (columnsToExpand * (expansionRate - 1));
  })

  // parsing all galaxies in pairs and getting the shortest path by adding differences between X and Y axis
  for (let i = 0; i < galaxyLocations.length - 1; i++) {
    for (let j = i + 1; j < galaxyLocations.length; j++) {
      const shortestPath =
        Math.abs(galaxyLocations[i].X - galaxyLocations[j].X) +
        Math.abs(galaxyLocations[i].Y - galaxyLocations[j].Y);
      shortestPathsSum += shortestPath;
    }
  }

  console.log(shortestPathsSum);
}

getShortestPathsSum();
