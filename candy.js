var candies = ["Blue", "maarten", "Green", "Yellow", "Red", "Purple"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var level = 0;

var currTile;
var otherTile;

window.onload = function () {
  startGame();

  //1/10th of a second
  //below is the looping game functionality like the "draw()" in p5
  window.setInterval(function () {
    crushCandy();
    slideCandy();
    generateCandy();
    levelUp();
  }, 100);
};

function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)]; //0 - 5.99
}

function startGame() {
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      // <img id="0-0" src="./images/Red.png">
      let tile = document.createElement("img");
      tile.id = r.toString() + "-" + c.toString();
      tile.src = "./images/" + randomCandy() + ".png";

      //DRAG FUNCTIONALITY
      tile.addEventListener("dragstart", dragStart); //click on a candy, initialize drag process
      tile.addEventListener("dragover", dragOver); //clicking on candy, moving mouse to drag the candy
      tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy
      tile.addEventListener("dragleave", dragLeave); //leave candy over another candy
      tile.addEventListener("drop", dragDrop); //dropping a candy over another candy
      tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap candies

      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }

  console.log(board);
}

function dragStart() {
  //this refers to tile that was clicked on for dragging
  currTile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  //this refers to the target tile that was dropped on
  otherTile = this;
}

function dragEnd() {
  if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
    return;
  }

  let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
  let r = parseInt(currCoords[0]);
  let c = parseInt(currCoords[1]);

  let otherCoords = otherTile.id.split("-");
  let r2 = parseInt(otherCoords[0]);
  let c2 = parseInt(otherCoords[1]);

  let moveLeft = c2 == c - 1 && r == r2;
  let moveRight = c2 == c + 1 && r == r2;

  let moveUp = r2 == r - 1 && c == c2;
  let moveDown = r2 == r + 1 && c == c2;

  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  if (isAdjacent) {
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;

    let validMove = checkValid();
    if (!validMove) {
      let currImg = currTile.src;
      let otherImg = otherTile.src;
      currTile.src = otherImg;
      otherTile.src = currImg;
    }
  }
  console.log(level);
}

function crushCandy() {
  //crushFive();
  crushFour();
  crushThree();
  document.getElementById("score").innerText = score;
}

// checking for x-in-a-rows:

function crushFour() {
  //check rows
  let boom = new Audio("boom.mp3");
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      let candy4 = board[r][c + 3];

      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy3.src == candy4.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        candy4.src = "./images/blank.png";

        score += 10;
        console.log("do something like: 4-BOOM!");
        boom.play();
      }
    }
  }

  //check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 3; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      let candy4 = board[r + 3][c];

      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy3.src == candy4.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        candy4.src = "./images/blank.png";
        score += 10;
        console.log("do something like: 4-BOOM! horIzOnTaL");
        boom.play();
      }
    }
  }
}

//////////////////33333333333333333333333333333/////////////////
function crushThree() {
  //check rows
  let cash = new Audio("cash-register.mp3");
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        score += 200;
        console.log("do something like:  BOOM!");
        cash.play();
      }
    }
  }

  //check columns
  let cheer = new Audio("cheers.mp3");
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        score += 200;
        cheer.play();
      }
    }
  }
}

function checkValid() {
  //check rows for validity
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("blank")
      ) {
        return true;
      }
    }
  }

  //check columns for validity
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("blank")
      ) {
        return true;
      }
    }
  }

  return false;
}

function slideCandy() {
  for (let c = 0; c < columns; c++) {
    let ind = rows - 1;
    for (let r = columns - 1; r >= 0; r--) {
      if (!board[r][c].src.includes("blank")) {
        board[ind][c].src = board[r][c].src;
        ind -= 1;
      }
    }

    for (let r = ind; r >= 0; r--) {
      board[r][c].src = "./images/blank.png";
    }
  }
}

function generateCandy() {
  for (let c = 0; c < columns; c++) {
    if (board[0][c].src.includes("blank")) {
      board[0][c].src = "./images/" + randomCandy() + ".png";
    }
  }
}

function levelUp() {
  if (score >= 1000 && level != 1 && level != 2) {
    var img = new Image(150, 150);
    img.src = "images/monster.png";
    block.appendChild(img);
    img.style.left = block.clientWidth / 2 + "px";
    img.style.top = block.clientHeight / 2 + "px";
    img.style.position = "absolute";
    level = 1;
  }
  if (score >= 1500 && level != 2) {
    var img2 = new Image(150, 150);
    img2.src = "images/monster-monnies.png";
    block.appendChild(img2);
    img2.style.left = block.clientWidth / 2 + "px";
    img2.style.top = block.clientHeight / 2 + "px";
    img2.style.position = "absolute";
    level = 2;
  }
  if (score >= 2500 && level != 3) {
    var img3 = new Image(150, 150);
    img3.src = "images/monster-monnies-wizard.png";
    block.appendChild(img3);
    img3.style.left = block.clientWidth / 2 + "px";
    img3.style.top = block.clientHeight / 2 + "px";
    img3.style.position = "absolute";
    level = 3;
  }
}
