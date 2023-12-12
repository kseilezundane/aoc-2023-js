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

  // stores all ..A nodes
  const sourceNodes = [];
  // stores all ..Z nodes
  const destinationNodes = [];

  for await (const line of rl) {
    const numbers = line.match(/\w+/g);
    if (numbers !== null) {
      if (numbers.length === 3) {
        if (numbers[0][2] === 'A') {
          sourceNodes.push(numbers[0]);
        }
        if (numbers[0][2] === 'Z') {
          destinationNodes.push(numbers[0]);
        }
        coordinates[numbers[0]] = {
          L: numbers[1],
          R: numbers[2]
        };
      } else {
        instructions = numbers[0];
      }
    }
  }

  let steps = 0;
  let currentNodes = sourceNodes;
  const stepsBySourceNode = [];


  // counting steps to reach ..Z node for each source node
  currentNodes.forEach((currentNode, index) => {
    steps = 0;
    while (currentNode[2] !== 'Z') {
      for (let i = 0; i < instructions.length; i++) {
        if (instructions[i] === 'R') {
          currentNode = coordinates[currentNode].R;
          steps++;
        } else {
          currentNode = coordinates[currentNode].L;
          steps++;
        }
        if (currentNode[2] === 'Z') {
          break;
        }
      }
    }
    stepsBySourceNode[index] = steps;
  });

  const leastCommonMultiple = (a, b) => (a * b) / greatestCommonDivisor(a, b);
  const greatestCommonDivisor = (a, b) => {
    const remainder = a % b;
    if (remainder === 0) {
      return b;
    }
    return greatestCommonDivisor(b, remainder);
  };

  // applying LCM principle to all the found steps for each source node
  const totalStepsCount = stepsBySourceNode.reduce((a, b) => leastCommonMultiple(a, b), 1)
  console.log(totalStepsCount);
}

getStepsCount();
