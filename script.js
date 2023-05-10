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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovement = function (movements) {
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov} €</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovement(account1.movements);

// calculate the current balance
const calcDisplayBalance = function (movement) {
  const balance = movement.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} EUR`;
};

calcDisplayBalance(account1.movements);
// Display transaction summary
const calcDisplaySummary = function (movements) {
  const income = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${income} €`;
  const expense = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(expense)} €`;
  const interest = movements
    .filter((mov) => mov > 0)
    .map((desposite) => (desposite * 1.2) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} €`;
};

calcDisplaySummary(account1.movements);
// Create username and add to the accunts object
const createUserName = function (accs) {
  accounts.forEach(function (acc) {
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
console.log(accounts);

// Event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;
  }
});

// ---------------------------------------------------------------
// the filter method
// const deposit = account1.movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposit);

// //withdrawals
// const withdrawal = account1.movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(withdrawal);

// // current balance
// const balance = account1.movements.reduce(function (acc, curr, i) {
//   console.log(`Itereation ${i}: ${acc}`);
//   return acc + curr;
// }, 0);
// console.log(balance);
// The Map, Filter, and Reduce array methods

// const movements = [200, -450, 400, 3000, -650, -130, 70, 1300];

// // Map
// const euroToUSD = 1.1;
// const movementsUSD = movements.map((mov) => {
//   return Math.floor(Math.abs(mov * euroToUSD));
// });

// console.log(movementsUSD);

// const movementsUSDFor = [];
// for (const movemnt of movements) {
//   movementsUSDFor.push(Math.floor(Math.abs(movemnt * euroToUSD)));
// }

// console.log(movementsUSDFor);

// const movementsDiscription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrawn"} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDiscription);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurUSD = 1.1;
// const totalDepositUSD = movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov * eurUSD)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositUSD);
