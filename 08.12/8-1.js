'use strict';

const fs = require('fs');
const readline = require('readline');

async function getStepsCount() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  // stores left and right steps by node in objects
  const coordinates = {};
  let instructions = '';

  for await (const line of rl) {
    const numbers = line.match(/\w+/g);
    if (numbers !== null) {
      if (numbers.length === 3) {
        coordinates[numbers[0]] = {
          L: numbers[1],
          R: numbers[2]
        };
      } else {
        instructions = numbers[0];
      }
    }
  }

  let currentNode = 'AAA';
  const destinationNode = 'ZZZ';
  let steps = 0;
  // navigating through the nodes until a goal node is found
  while (currentNode !== destinationNode) {
    for (let i = 0; i < instructions.length; i++) {
      console.log(currentNode);
      if (instructions[i] === 'R') {
        currentNode = coordinates[currentNode].R;
        steps++;
      } else {
        currentNode = coordinates[currentNode].L;
        steps++;
      }
      if (currentNode === destinationNode) {
        break;
      }
    }
  }

  console.log(steps);
}

getStepsCount();
