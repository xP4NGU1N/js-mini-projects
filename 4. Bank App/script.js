'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Ryan Pan',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// GERNERATE USERNAME
const generateUsername = function (names) {
  names.forEach(function (name) {
    const words = name.owner.toLowerCase().split(' ');
    name.username = words
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};
generateUsername(accounts);
// START TIMER
let timer;
const startTimer = function () {
  let timerDuration = 100;
  timer = setInterval(function () {
    if (timerDuration === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    labelTimer.textContent = `${String(Math.trunc(timerDuration / 60)).padStart(
      2,
      0
    )}:${String(timerDuration % 60).padStart(2, 0)}`;
    timerDuration--;
  }, 1000);
};
// LOG IN TO ACCOUNT
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const user = inputLoginUsername.value;
  currentAccount = accounts.find(function (account) {
    return account.username === user;
  });
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    if (timer) {
      clearInterval(timer);
    }
    startTimer();
    updateAccount(currentAccount);
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    alert('Invalid user or PIN. Try again.');
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginUsername.focus();
  }
});
// CONVERT CURRENCY
const convertCur = function (value, currency, locale) {
  const options = { style: 'currency', currency: `${currency}` };
  return new Intl.NumberFormat(locale, options).format(value);
};
// DISPLAY TRANSACTIONS
const checkTime = function (account, movementDate) {
  const timeNow = new Date();
  if (Math.trunc((movementDate - timeNow) / (1000 * 60 * 60 * 24)) === 0)
    return 'Today';
  else if (Math.trunc((movementDate - timeNow) / (1000 * 60 * 60 * 24)) === 1)
    return 'Yesterday';
  else return new Intl.DateTimeFormat(account.locale).format(movementDate);
};
const displayMov = function (account, sort = false) {
  const movements = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const movementDate = new Date(
      account.movementsDates[
        account.movements.findIndex(movement => movement === mov)
      ]
    );
    const displayDate = checkTime(account, movementDate);
    const transactionType = mov > 0 ? 'deposit' : 'withdrawal';
    const transaction = `
    <div class="movements__row">
    <div class="movements__type movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${convertCur(
      mov,
      account.currency,
      account.locale
    )}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', transaction);
  });
};
// DISPLAY SUMMARY
const displaySummary = function (acc) {
  // DEPOSIT
  const deposit = acc.movements
    .filter(function (movement) {
      return movement > 0;
    })
    .reduce(function (acc, movement) {
      return acc + movement;
    }, 0);
  labelSumIn.textContent = `${convertCur(deposit, acc.currency, acc.locale)}`;
  // WITHDRAWAL
  const withdrawal = acc.movements
    .filter(function (movement) {
      return movement < 0;
    })
    .reduce(function (acc, movement) {
      return acc + Math.abs(movement);
    }, 0);
  labelSumOut.textContent = `${convertCur(
    withdrawal,
    acc.currency,
    acc.locale
  )}`;
  // INTEREST
  const interest = acc.movements
    .filter(function (movement) {
      return movement > 0;
    })
    .map(function (movement) {
      return movement * (acc.interestRate / 100);
    })
    .filter(function (interest) {
      return interest >= 1;
    })
    .reduce(function (acc, interest) {
      return acc + interest;
    }, 0);
  labelSumInterest.textContent = `${convertCur(
    interest,
    acc.currency,
    acc.locale
  )}`;
};
// DISPLAY BALANCE
const displayBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${convertCur(
    account.balance,
    account.currency,
    account.locale
  )}`;
};
// DISPLAY TIME
const displayTime = function (account) {
  const liveTime = new Date();
  const option = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const displayTime = new Intl.DateTimeFormat(account.locale, option).format(
    liveTime
  );
  labelDate.textContent = `${displayTime}`;
};

const updateAccount = function (account) {
  displayBalance(account);
  displaySummary(account);
  displayMov(account);
  displayTime(account);
};

// SORT MOVEMENTS
let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMov(currentAccount, !sort);
  sort = !sort;
});
// TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  clearInterval(timer);
  startTimer();
  const recipientUser = inputTransferTo.value;
  const transferAmount = Number(inputTransferAmount.value) || 0;
  const recipient = accounts.find(function (account) {
    return recipientUser === account.username;
  });
  if (
    recipient &&
    recipient !== currentAccount.username &&
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance
  ) {
    recipient.movements.push(transferAmount);
    currentAccount.movements.push(transferAmount * -1);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
    const transferTime = new Date();
    currentAccount.movementsDates.push(transferTime.toISOString());
    recipient.movementsDates.push(transferTime.toISOString());
    updateAccount(currentAccount);
  } else {
    alert('Invalid recipient or amount.');
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.focus();
  }
});
// REQUEST LOAN: DEPOSIT
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  clearInterval(timer);
  setTimeout(function () {
    if (
      currentAccount.movements.some(
        movement => movement >= 0.1 * Number(inputLoanAmount.value)
      )
    ) {
      const loanAmount = Math.floor(inputLoanAmount.value);

      alert(
        `${convertCur(
          loanAmount,
          currentAccount.currency,
          currentAccount.locale
        )} loan approved.`
      );
      currentAccount.movements.push(loanAmount);
      const loanTime = new Date();
      currentAccount.movementsDates.push(loanTime.toISOString());
      updateAccount(currentAccount);
      inputLoanAmount.value = '';
      inputLoanAmount.blur();
    } else {
      alert(
        'Invalid loan amount.\nNote: At least 1 deposit must be greater than 10% of your loan amount.'
      );
      inputLoanAmount.value = '';
    }
  }, 3000);
  startTimer();
});
// CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  clearInterval(timer);
  startTimer();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(
        account => account.username === currentAccount.username
      ),
      1
    );
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;
  } else {
    alert('Invalid user or PIN.');
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.focus();
  }
});
