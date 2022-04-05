"use strict";
//logic
let currentColor = "pink";
const size = 8;
let turns = 4;
("");
const matGame = new Array(size).fill(Array(size).fill(""));

const matColor = [
  new Array(size).fill("grey"),
  new Array(size).fill("grey"),
  new Array(size).fill("grey"),
  new Array(size).fill("grey"),
  new Array(size).fill("grey"),
  new Array(size).fill("grey"),
  new Array(size).fill("grey"),
  new Array(size).fill("grey"),
];
const table = document.querySelector("table");

const checkIfCertainLockIsValid = function (i, j) {
  return i < size && i > -1 && j < size && j > -1;
};
const selectCellFun = function (e) {
  if (convertNumToIndexes(+e.target.dataset.num)) {
    e.target.classList.add(`${currentColor}`);
    currentColor = currentColor === "pink" ? "green" : "pink";
    e.target.removeEventListener("click", selectCellFun);
    turns++;
    if (turns === size * size || gameOver()) {
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
    i < size && i > -1 && j < size && j > -1;
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
function returnsTrueIfTurnAllowed(i, j) {
  return (
    rtrnsTrueIfcetrainDirectionHasMatch(i, j, 1, 1) ||
    rtrnsTrueIfcetrainDirectionHasMatch(i, j, 1, -1) ||
    rtrnsTrueIfcetrainDirectionHasMatch(i, j, -1, 1) ||
    rtrnsTrueIfcetrainDirectionHasMatch(i, j, -1, -1) ||
    rtrnsTrueIfcetrainDirectionHasMatch(i, j, 0, 1) ||
    rtrnsTrueIfcetrainDirectionHasMatch(i, j, 1, 0) ||
    rtrnsTrueIfcetrainDirectionHasMatch(i, j, -1, 0) ||
    rtrnsTrueIfcetrainDirectionHasMatch(i, j, 0, -1)
  );
}
function changeColor(i, j, goi, goj) {
  const opposie = currentColor === "pink" ? "green" : "pink";
  for (i += goi, j += goj; matColor[i][j] === opposie; i += goi, j += goj) {
    matColor[i][j] = currentColor;
    document
      .querySelector(`[data-num='${i * size + j}']`)
      .classList.remove(`${opposie}`);
    document
      .querySelector(`[data-num='${i * size + j}']`)
      .classList.add(`${currentColor}`);
  }
}
function changeColorsInBOthMats(i, j) {
  if (rtrnsTrueIfcetrainDirectionHasMatch(i, j, 1, 1)) changeColor(i, j, 1, 1);
  if (rtrnsTrueIfcetrainDirectionHasMatch(i, j, 1, -1))
    changeColor(i, j, 1, -1);
  if (rtrnsTrueIfcetrainDirectionHasMatch(i, j, -1, 1))
    changeColor(i, j, -1, 1);
  if (rtrnsTrueIfcetrainDirectionHasMatch(i, j, -1, -1))
    changeColor(i, j, -1, -1);
  if (rtrnsTrueIfcetrainDirectionHasMatch(i, j, 0, 1)) changeColor(i, j, 0, 1);
  if (rtrnsTrueIfcetrainDirectionHasMatch(i, j, 1, 0)) changeColor(i, j, 1, 0);
  if (rtrnsTrueIfcetrainDirectionHasMatch(i, j, -1, 0))
    changeColor(i, j, -1, 0);
  if (rtrnsTrueIfcetrainDirectionHasMatch(i, j, 0, -1))
    changeColor(i, j, 0, -1);
  matColor[i][j] = currentColor;
}
// a function that is called after each turn (calls the second function) paints the squares
//a function that gets num of cell and calls aother function with the indexes
const convertNumToIndexes = function (num) {
  let i, j;
  i = Math.trunc(num / size);
  j = num % size;
  // console.log(`mat[${i},${j}] :${matColor[i][j]}`);
  const allowed = returnsTrueIfTurnAllowed(i, j);
  if (allowed) changeColorsInBOthMats(i, j);
  return allowed;
};
//a function that couts who is the winner after x turns
for (let i = 0, num = 0; i < matGame.length; i++) {
  const newRow = table.insertRow(table.length);
  for (let j = 0; j < matGame[i].length; j++, num++) {
    const cell = newRow.insertCell(j);
    cell.innerHTML = matGame[i][j];
    cell.classList.add("cell");
    cell.dataset.num = num;
    cell.addEventListener("click", selectCellFun);
  }
}
const setGame = function () {
  matColor[size / 2][size / 2 - 1] = "green";
  matColor[size / 2 - 1][size / 2] = "green";
  matColor[size / 2 - 1][size / 2 - 1] = "pink";
  matColor[size / 2][size / 2] = "pink";
  document
    .querySelector(`[data-num='${(size / 2 - 1) * size + (size / 2 - 1)}']`)
    .classList.add("pink");
  document
    .querySelector(`[data-num='${(size / 2) * size + size / 2}']`)
    .classList.add("pink");
  document
    .querySelector(`[data-num='${(size / 2) * size + (size / 2 - 1)}']`)
    .classList.add("green");
  document
    .querySelector(`[data-num='${(size / 2 - 1) * size + size / 2}']`)
    .classList.add("green");
};

setGame();
const gameOver = function () {
  for (let i = 0; i < matColor.length; i++) {
    for (let j = 0; j < matColor[i].length; j++)
      if (matColor[i][j] === "grey")
        if (returnsTrueIfTurnAllowed(i, j)) return false;
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
    if (pink > green) console.log("pink has won!!!");
    else console.log("green has won");
  }
};
