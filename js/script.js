let m = 0;
let n = 0;
let x = 0;
const BOMB = "bomb";
let score = 0;
let matrix = null;
let randomList = null;
let gameStatus = false;
const scoreElement = document.getElementById("score");
const rightSound = document.getElementById("right-sound");
const wrongSound = document.getElementById("wrong-sound");

// returns a div
const createDiv = () => {
  const gridDiv = document.createElement("div");
  return gridDiv;
};

//return row for dom
const createRow = (parent) => {
  const row = createDiv();
  row.setAttribute("class", "row");
  row.style.height = 100 / m + "%";
  return row;
};

//returns cell
const createCell = (i, j, parent) => {
  const id = i + "" + j;
  const cell = createDiv();
  cell.setAttribute("id", id);
  cell.setAttribute("class", "cell");
  cell.setAttribute("onclick", "handleClick(this)");
  cell.style.width = 85 / n + "%";
  return cell;
};
//creates a bomb image and returns it
const getBomb = () => {
  const img = document.createElement("img");
  img.setAttribute("src", "/images/bomb.svg");
  img.setAttribute("height", "50%");
  img.setAttribute("width", "50%");
  img.setAttribute("alt", "bomb");
  return img;
};

//initializing logical representation of dom grid i.e. matrix
const initMatrix = () => {
  matrix = new Array(m).fill("").map(() => new Array(n).fill(""));
};

// counting the bombs present adjacent to every element
const countAdjacentBombs = (i, j) => {
  let count = 0;
  if (i - 1 >= 0 && j - 1 >= 0 && matrix[i - 1][j - 1] === BOMB) count++; //a
  if (i - 1 >= 0 && matrix[i - 1][j] === BOMB) count++; //b
  if (i - 1 >= 0 && j + 1 < n && matrix[i - 1][j + 1] === BOMB) count++; //c
  if (j + 1 < n && matrix[i][j + 1] === BOMB) count++; //d
  if (i + 1 < m && j + 1 <= n && matrix[i + 1][j + 1] === BOMB) count++; //e
  if (i + 1 < m && matrix[i + 1][j] === BOMB) count++; //f
  if (i + 1 < m && j - 1 >= 0 && matrix[i + 1][j - 1] === BOMB) count++; //g
  if (j - 1 >= 0 && matrix[i][j - 1] === BOMB) count++; //h
  return count;
};

// putting bomb information in matrix, so that no need to access dom element so often
const reinitializeMatrix = () => {
  for (let i = 0; i < m; ++i) {
    for (let j = 0; j < n; ++j) {
      if (matrix[i][j] === 0) {
        matrix[i][j] = countAdjacentBombs(i, j);
      } else {
        matrix[i][j] = BOMB;
      }
    }
  }
  console.log(matrix);
};

//it runs when bomb has been found
const showAllBombs = () => {
  for (let i = 0; i < m; ++i) {
    for (let j = 0; j < n; ++j) {
      if (matrix[i][j] === BOMB) {
        document.getElementById(i + "" + j).appendChild(getBomb());
      }
    }
  }
  setTimeout(() => {
    alert("Game Over!");
  }, 3000);
};

const takeInput = () => {
  m = parseInt(document.getElementById("m").value, 10);
  n = parseInt(document.getElementById("n").value, 10);
  x = parseInt(document.getElementById("x").value, 10);
};

// returns a list of randome number list between a range and of a particular size
const getRandomList = (size, range) => {
  let randomList = [];
  for (let i = 1; i <= size; ) {
    let x = Math.floor(Math.random() * range);
    if (randomList.includes(x)) continue;
    else {
      randomList.push(x);
      i++;
    }
  }
  return randomList;
};
const updateScore = () => {
  // score div is updated, for no
  score++;
  scoreElement.innerText = score;
};

const handleClick = (ele) => {
  // executes when a cell is clicked
  if (!gameStatus) return;
  const id = ele.id;
  const i = parseInt(id[0], 10);
  const j = parseInt(id[1], 10);

  if (matrix[i][j] === "VISITED") {
    return;
  }
  if (matrix[i][j] === BOMB) {
    wrongSound.play();
    showAllBombs();
    gameStatus = false;
  } else {
    updateScore();
    rightSound.play();
    ele.innerText = matrix[i][j];
    ele.style.background = "#06a303";
    matrix[i][j] = "VISITED";
  }
};

const initGrid = () => {
  // initializing DOM Grid
  initMatrix();

  const grid = createDiv();
  grid.setAttribute("class", "grid");

  //find  random bomb positions
  randomList = getRandomList(x, m * n);
  let count = 1;
  for (let i = 0; i < m; ++i) {
    const row = createRow(grid);
    for (let j = 0; j < n; ++j) {
      const cell = createCell(i, j, row);
      cell.setAttribute("name", count);
      matrix[i][j] = randomList.includes(count) ? BOMB : 0;
      row.appendChild(cell);
      count++;
    }
    grid.appendChild(row);
  }

  document.getElementById("game-container").appendChild(grid);
  reinitializeMatrix(); // for counting adjacent bombs
  gameStatus = true;
};

const play = () => {
  // main point
  takeInput();
  initGrid();
};
//play();
