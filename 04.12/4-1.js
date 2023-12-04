'use strict';

const fs = require('fs');
const readline = require('readline');

async function getTotalGamePoints() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let totalPoints = 0;

  for await (const line of rl) {
    // retrieving all numbers involved in the game
    const gameNumbers = line.split(': ')[1];
    // splitting winning numbers and my numbers
    const splitGameNumbers = gameNumbers.split(' | ');
    const winningNumbers = splitGameNumbers[0].match(/\d+/g);
    const myNumbers = splitGameNumbers[1].match(/\d+/g);

    let gamePoints = 0;
    // parsing winning numbers and checking if they are in my numbers;
    winningNumbers.forEach(number => {
      if (myNumbers.includes(number)) {
        gamePoints = gamePoints === 0 ? 1 : gamePoints * 2;
      }
    });

    totalPoints += gamePoints;
  }
  console.log(totalPoints);
}

getTotalGamePoints();
