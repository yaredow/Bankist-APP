'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
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

// Format the movement days
const formatMovementDays = function (date) {
  const calcDaysPassed = (day1, day2) =>
    Math.abs(day2 - day1) / (1000 * 60 * 60 * 24 * 365);

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

// Display movement
const displayMovement = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const moves = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  moves.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const dates = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDays(dates);

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)} €</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// calculate the current balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};
// Display transaction summary
const calcDisplaySummary = function (movements) {
  const income = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${income.toFixed(2)} €`;
  const expense = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(expense).toFixed(2)} €`;
  const interest = movements
    .filter((mov) => mov > 0)
    .map((desposite) => (desposite * 1.2) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};

// Create username and add to the accunts object
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((word) => {
        return word[0];
      })
      .join('');
  });
};
createUserName(accounts);

// updateUI
const updateUI = function (acc) {
  // Display movements
  displayMovement(account1);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc.movements);
};

// Event handler
let currentAccount;
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

const now = new Date();
const date = `${now.getDate()}`.padStart(2, 0);
const month = now.getMonth();
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const minute = `${now.getMinutes()}`.padStart(2, 0);

labelDate.textContent = `${date}/${month}/${year}, ${hour}:${minute}`;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;

    // Clear login field
    inputLoginPin.value = inputLoginUsername.value = '';

    // Display UI
    updateUI(currentAccount);
  }
});

// Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = floor(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (account) => account.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    transferAmount > 0 &&
    recieverAcc &&
    currentAccount.balance >= transferAmount &&
    recieverAcc?.username !== currentAccount
  ) {
    currentAccount.movements.push(-transferAmount);
    recieverAcc.movements.push(transferAmount);
    // add transfer date
    currentAccount.movementsDates.push(new toISOString());
    recieverAcc.movementsDates.push(new toISOString());

    updateUI(currentAccount);
  }
});

// Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = +inputLoanAmount.value;
  if (
    currentAccount.movements.some((mov) => mov > (loanAmount * 10) / 100) &&
    loanAmount > 0
  ) {
    currentAccount.movements.push(loanAmount);

    // add a new date
    currentAccount.movementsDates.push(new Date().toISOString());
    // update the UI
    updateUI(currentAccount);
  }
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;

    console.log(accounts);
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
// Sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// -------------------------------------------------------

// console.log(Number.parseInt('130px'));
// console.log(Number.isNaN(+'24x'));

// console.log(Math.max(2, 4, 7, 18));
// console.log(Math.sqrt(81));
// console.log(8 ** (1 / 3));

// const randomInt = (max, min) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(2, 6));

// console.log('=============================================');

// console.log(Math.trunc(23.3));
// console.log(Math.trunc(23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));

// console.log(Math.round(23.3));
// console.log(Math.round(23.3));

// console.log(Number.MAX_SAFE_INTEGER);
// // Create a date
// const now = new Date();
// console.log(now);
// console.log(account1.movementsDates[0]);

// const day1Passed = calcDaysPassed(
//   new Date(1996, 12, 30),
//   new Date(2023, 5, 16)
// );

// console.log(day1Passed);
