'use strict';

// INSTRUCTIONS
const showModal = document.querySelector('.show-modal');
const hideModal = document.querySelector('.close-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

showModal.addEventListener('click', function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
});

hideModal.addEventListener('click', function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
});

document.addEventListener('keydown', function (btn) {
  if (btn.key === 'Escape' && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  }
});

// GAME
// Variables (Display)
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');

const player0Score = document.getElementById('score--0');
const player1Score = document.getElementById('score--1');

const player0Current = document.getElementById('current--0');
const player1Current = document.getElementById('current--1');

const dice = document.querySelector('.dice');

// Variables (Data)
let currentScore, totalScore, activePlayer, game;

// Buttons
const newGame = document.querySelector('.btn--new');
const roll = document.querySelector('.btn--roll');
const hold = document.querySelector('.btn--hold');

const init = function () {
  game = true;
  currentScore = activePlayer = 0;
  totalScore = [0, 0];

  player0.classList.add('player--active');
  player1.classList.remove('player--active');

  player0.classList.remove('player--winner');
  player1.classList.remove('player--winner');

  player0Score.textContent = 0;
  player0Current.textContent = 0;

  player1Score.textContent = 0;
  player1Current.textContent = 0;

  dice.classList.add('hidden');
};

const swapPlayers = function () {
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0.classList.toggle('player--active');
  player1.classList.toggle('player--active');
};

const resetCurrent = function () {
  currentScore = 0;
  document.getElementById(
    `current--${activePlayer}`
  ).textContent = `${currentScore}`;
};

init();

// Roll Dice
roll.addEventListener('click', function () {
  if (game) {
    let diceRoll = Math.trunc(Math.random() * 6 + 1);

    dice.src = `dice-${diceRoll}.png`;
    dice.classList.remove('hidden');

    if (diceRoll === 1) {
      // Reset score
      resetCurrent();
      // Active player change
      swapPlayers();
    } else {
      // Add to score
      currentScore += diceRoll;
      document.getElementById(
        `current--${activePlayer}`
      ).textContent = `${currentScore}`;
    }
  }
});

// Hold
hold.addEventListener('click', function () {
  if (game) {
    // Update score
    totalScore[activePlayer] += currentScore;
    // Check winner
    if (totalScore[activePlayer] >= 100) {
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      // End game
      dice.classList.add('hidden');
      game = false;
    } else {
      // Update score display
      document.getElementById(
        `score--${activePlayer}`
      ).textContent = `${totalScore[activePlayer]}`;
      resetCurrent();
      swapPlayers();
    }
  }
});

// New Game
newGame.addEventListener('click', init);
