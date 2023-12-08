'use strict';

const fs = require('fs');
const readline = require('readline');

async function getCamelCardsWinnings() {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const cards = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

  const handsTypes = {
    fiveOfAKind: [],
    fourOfAKind: [],
    fullHouse: [],
    threeOfAKind: [],
    twoPair: [],
    onePair: [],
    highCard: []
  }

  for await (const line of rl) {
    const hands = line.split(' ');
    const handCards = hands[0];
    const handBid = Number(hands[1]);

    // counting each symbol occurrence in the hand
    const symbols = {};
    for (let i = 0; i < handCards.length; i ++) {
      symbols[handCards[i]] = symbols[handCards[i]] + 1 || 1
    }

    // throwing out jokers to find a current maximum combo
    const { J: _, ...cardsWithoutJoker } = symbols;
    const combos = [...Object.values(cardsWithoutJoker), 0];
    let maxCombo = Math.max(...combos);

    // adding jokers to the max combo if they exist
    if (symbols.J) {
      maxCombo = maxCombo + symbols.J;
    }

    if (maxCombo === 5) {
      handsTypes.fiveOfAKind.push({ cards: handCards, bid: handBid});
    }
    if (maxCombo === 4) {
      handsTypes.fourOfAKind.push({ cards: handCards, bid: handBid});
    }
    if (maxCombo === 3) {
      // special handling of case when Joker creates a full house - handling cases with and without Joker
      if ((combos.includes(2) && combos.includes(3)) || (combos.indexOf(2) !== combos.lastIndexOf(2))) {
        handsTypes.fullHouse.push({ cards: handCards, bid: handBid});
      } else {
        handsTypes.threeOfAKind.push({ cards: handCards, bid: handBid});
      }
    }
    if (maxCombo === 2) {
      if (combos.indexOf(2) !== combos.lastIndexOf(2)) {
        handsTypes.twoPair.push({ cards: handCards, bid: handBid});
      } else {
        handsTypes.onePair.push({ cards: handCards, bid: handBid});
      }
    }
    if (maxCombo === 1) {
      handsTypes.highCard.push({ cards: handCards, bid: handBid});
    }
  }

  // sorting hands by one card
  function sortCards(handOne, handTwo) {
    for (let i = 0; i < 5; i++) {
      if (cards.indexOf(handOne.cards[i]) > cards.indexOf(handTwo.cards[i])) {
        return -1;
      } else if (cards.indexOf(handOne.cards[i]) < cards.indexOf(handTwo.cards[i])) {
        return 1;
      }
    }
    return 0;
  }

  for (const hand in handsTypes) {
    handsTypes[hand] = handsTypes[hand].sort(sortCards);
  }

  // merging all hands types to one array by hands' priorities
  const allHands = [
    ...handsTypes.highCard,
    ...handsTypes.onePair,
    ...handsTypes.twoPair,
    ...handsTypes.threeOfAKind,
    ...handsTypes.fullHouse,
    ...handsTypes.fourOfAKind,
    ...handsTypes.fiveOfAKind
  ];

  // getting the sum of the bids
  console.log(allHands.reduce((accumulator, hand, index) => accumulator + (hand.bid * (index + 1)) , 0))
}

getCamelCardsWinnings();
