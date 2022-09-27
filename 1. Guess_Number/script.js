'use strict';

let displayMsg = function (message) {
  document.querySelector('.message').textContent = message;
};
let secretNumber = Math.trunc(20 * Math.random()) + 1;
let score = 20;
let highscore = 0;

document.querySelector('.check').addEventListener('click', function () {
  let number = Number(document.querySelector('.guess').value);
  if (!number) {
    displayMsg('😕 Input a number!');
  } else if (number < 1 || number > 20) {
    displayMsg('😕 Number is between 1 and 20!');
  } else if (number === secretNumber) {
    document.querySelector('body').style.backgroundColor = 'rgb(75,181,67)';
    document.querySelector('.number').textContent = number;
    document.querySelector('.number').style.width = '30rem';
    displayMsg('👑 Correct Number!');
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = score;
    }
  } else if (score > 1) {
    displayMsg(
      number < secretNumber
        ? '😿 Too low, try again!'
        : '😿 Too high, try again!'
    );
    score--;
  } else {
    score = 0;
    displayMsg('☠ Game over');
    document.querySelector('body').style.backgroundColor = 'rgb(143,29,33)';
  }
  document.querySelector('.score').textContent = score;
});

document.querySelector('.again').addEventListener('click', function () {
  secretNumber = Math.trunc(20 * Math.random()) + 1;
  score = 20;
  displayMsg('Start guessing...');
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = '?';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.guess').value = '';
  document.querySelector('body').style.backgroundColor = '#222';
});
