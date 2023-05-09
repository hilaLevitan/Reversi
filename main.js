"use strict";
//logic
const SIZE = 8;
let currentColor = "pink";
let turns = 4;

const matColor = [
  new Array(SIZE).fill("grey"),
  new Array(SIZE).fill("grey"),
  new Array(SIZE).fill("grey"),
  new Array(SIZE).fill("grey"),
  new Array(SIZE).fill("grey"),
  new Array(SIZE).fill("grey"),
  new Array(SIZE).fill("grey"),
  new Array(SIZE).fill("grey"),
];
const table = document.querySelector("table");
const createAllSquares = function () {
  for (let i = 0, num = 0; i < SIZE; i++) {
    const newRow = table.insertRow();
    for (let j = 0; j < SIZE; j++, num++) {
      const cell = newRow.insertCell(j);
      cell.classList.add("cell");
      cell.dataset.num = num;
      cell.addEventListener("click", selectCellFun);
    }
  }
};
const checkIfCertainLockIsValid = function (i, j) {
  return i < SIZE && i > -1 && j < SIZE && j > -1;
};
const selectCellFun = function (e) {
  if (checkIfTurnAllowedAndIfSoMakeTurn(+e.target.dataset.num)) {
    e.target.classList.add(`${currentColor}`);
    currentColor = currentColor === "pink" ? "green" : "pink";
    e.target.removeEventListener("click", selectCellFun);
    turns++;
    if (turns === SIZE * SIZE || gameOver()) {
      victory();
      console.log("victory", turns);
    }
  }
  if (turns > 50) console.log(matColor);
};
//a function that returns true if a cetrain direction has a match
function rtrnsTrueIfcetrainDirectionHasMatch(i, j, goi, goj) {
  let thereIsAnotherColor = false;
  for (
    i += goi, j += goj;
    i < SIZE && i > -1 && j < SIZE && j > -1;
    i += goi, j += goj
  ) {
    if (!checkIfCertainLockIsValid(i, j)) return false;
    if (matColor[i][j] !== "grey" && matColor[i][j] !== currentColor)
      thereIsAnotherColor = true;
    if (!thereIsAnotherColor) return false;
    if (matColor[i][j] === currentColor) return true;
  }
  return false;
}
function isTurnAllowed(i, j) {
  for (let first = -1; first <= 1; first++) {
    for (let second = -1; second <= 1; second++) {
      if (first == 0 && second == 0) continue;
      if (rtrnsTrueIfcetrainDirectionHasMatch(i, j, first, second)) return true;
    }
  }
  return false;
}
function changeColor(i, j, goi, goj) {
  const opposie = currentColor === "pink" ? "green" : "pink";
  for (i += goi, j += goj; matColor[i][j] === opposie; i += goi, j += goj) {
    matColor[i][j] = currentColor;
    document
      .querySelector(`[data-num='${i * SIZE + j}']`)
      .classList.remove(`${opposie}`);
    document
      .querySelector(`[data-num='${i * SIZE + j}']`)
      .classList.add(`${currentColor}`);
  }
}
function changeColorsInBOthMats(i, j) {
  for (let first = -1; first <= 1; first++) {
    for (let second = -1; second <= 1; second++) {
      if (first == 0 && second == 0) continue;
      if (rtrnsTrueIfcetrainDirectionHasMatch(i, j, first, second))
        changeColor(i, j, first, second);
    }
  }
  matColor[i][j] = currentColor;
}
// a function that is called after each turn (calls the second function) paints the squares
//a function that gets num of cell and calls aother function with the indexes
const checkIfTurnAllowedAndIfSoMakeTurn = function (num) {
  let i, j;
  i = Math.trunc(num / SIZE);
  j = num % SIZE;
  const allowed = isTurnAllowed(i, j);
  if (allowed) changeColorsInBOthMats(i, j);
  return allowed;
};
//a function that couts who is the winner after x turns

const selectFirstFourSquares = function () {
  matColor[SIZE / 2][SIZE / 2 - 1] = "green";
  matColor[SIZE / 2 - 1][SIZE / 2] = "green";
  matColor[SIZE / 2 - 1][SIZE / 2 - 1] = "pink";
  matColor[SIZE / 2][SIZE / 2] = "pink";
  document
    .querySelector(`[data-num='${(SIZE / 2 - 1) * SIZE + (SIZE / 2 - 1)}']`)
    .classList.add("pink");
  document
    .querySelector(`[data-num='${(SIZE / 2) * SIZE + SIZE / 2}']`)
    .classList.add("pink");
  document
    .querySelector(`[data-num='${(SIZE / 2) * SIZE + (SIZE / 2 - 1)}']`)
    .classList.add("green");
  document
    .querySelector(`[data-num='${(SIZE / 2 - 1) * SIZE + SIZE / 2}']`)
    .classList.add("green");
};
const setGame = function () {
  document.querySelector("h1").textContent = "Reversi";
  const allSqures = document.querySelectorAll(".cell");
  for (const square of allSqures) {
    square.classList.remove("pink", "green", "blink");
  }
  for (let i = 0; i < matColor.length; i++)
    for (let j = 0; j < matColor[i].length; j++) matColor[i][j] = "grey";
  selectFirstFourSquares();
  for (const square of allSqures) {
    if (
      !square.classList.contains("pink") &&
      !square.classList.contains("green")
    )
      square.addEventListener("click", selectCellFun);
  }
  currentColor = "pink";
};

const gameOver = function () {
  for (let i = 0; i < matColor.length; i++) {
    for (let j = 0; j < matColor[i].length; j++)
      if (matColor[i][j] === "grey") if (isTurnAllowed(i, j)) return false;
  }
  return true;
};
const victory = function () {
  let pink = 0;
  let green = 0;
  for (let i = 0; i < matColor.length; i++) {
    for (let j = 0; j < matColor[i].length; j++) {
      if (matColor[i][j] === "pink") pink++;
      if (matColor[i][j] === "green") green++;
    }

    const allSqures = document.querySelectorAll(".cell");
    const winner = pink > green ? "pink" : "green";

    for (const square of allSqures)
      if (square.classList.contains(`${winner}`)) square.classList.add("blink");

    document.querySelector("h1").textContent = `${
      winner === "pink" ? "player 1 won!!" : "player 2 won!!"
    }`;
  }
};
//SET THE GAME
const btnSet = document.querySelector(".btn");
btnSet.addEventListener("click", setGame);
createAllSquares();
setGame();
