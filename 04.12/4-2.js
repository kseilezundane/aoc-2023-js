'use strict';

const fs = require('fs');
const readline = require('readline');

async function getPossibleGames() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  // stores card numbers and amount of copies for each of them
  const cardCopies = {};

  let X = 1; // impossible to retrieve index of async reading so I'm making it myself :D
  for await (const line of rl) {
    // retrieving all numbers involved in the game
    const gameNumbers = line.split(': ')[1];
    // splitting winning numbers and my numbers
    const splitGameNumbers = gameNumbers.split(' | ');
    const winningNumbers = splitGameNumbers[0].match(/\d+/g);
    const myNumbers = splitGameNumbers[1].match(/\d+/g);

    // counts amount of matching numbers
    let matchingNumbers = 0;
    winningNumbers.forEach(number => {
      if (myNumbers.includes(number)) {
        matchingNumbers++;
      }
    });

    // adds original card to the card object
    if (cardCopies[X]) {
      cardCopies[X]++;
    } else {
      cardCopies[X] = 1;
    }

    // adds won copies to the card object
    for (let i = 1; i <= matchingNumbers; i++) {
      cardCopies [X + i] = cardCopies[X + i] ? cardCopies[X + i] + (1 * cardCopies[X]) : (1 * cardCopies[X]);
    }
    X++;
  }

  const totalCardAmount = Object.values(cardCopies).reduce((sum, cardAmount) => sum + cardAmount, 0);
  console.log(totalCardAmount);
}

getPossibleGames();
