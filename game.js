
// some variables I'll need later
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let frames = 0;
let interval;
let img;
let music;
const obstacles = [];
const questions = [];
canvas.width = 800;
canvas.height = 600;

function sound(src) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.style.display = 'none';
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

// prints the background image on canvas
function drawBackground() {
  let img = new Image();
  img.src = './images/background2.png';
  ctx.drawImage(img, 0, 0, 800, 600);
}
drawBackground();

// a class for the player
class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.score = 0;
    this.lives = 3;
  }

  icon() {
    let img = new Image();
    img.src = './images/girl dev.png';
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }

  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  crash(bug) {
    if (this.x + this.width > bug.x && this.x < bug.x + bug.width && this.y < bug.y + bug.height && this.y + this.height > bug.y) {
      return true;
    }
  }
}

// setting the player and calling the method to print it on canvas
const devGirl = new Player(0, 225, 80, 80);
devGirl.icon();

let buttonState = true;
music = new sound('./audio/Coruscate_-_Korobeiniki_Ditto.mp3');

function button() {
  gameTime();
  // buttonState = !buttonState;
  if (buttonState) {
    music.play();
    gameStart.innerHTML = '';
    buttonState = !buttonState;
  }
}

// sets the interval
function gameTime() {
  // startGame();
  interval = setInterval(() => {
    updateGame();
    frames += 1;
  }, 15);
}

// calls the interval when the right answer is clicked
function rightAnswerInterval() {
  gameTime();
  getTheDiv.innerHTML = '';
}

// Updates and prints the score on canvas
function updateScore() {
  if (frames % 20 === 0) {
    devGirl.score += 1;
  }
  ctx.font = '18px serif';
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + devGirl.score, 700, 30);
}

function clear() {
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  drawBackground();
  devGirl.icon();
}

// game engine
function updateGame() {
  clear();
  lives();
  devGirl.newPos();
  createObstacle();
  createQuestion();
  updateScore();
  obstacles.forEach((obst) => {
    obst.drawObstacle();
  });
  questions.forEach((questions) => {
    questions.questionMark();
    if (devGirl.crash(questions) && canCrash) {
      canCrash = false;
      ask(questionsArr);
      clearInterval(interval);
    }
  });
  checkGameOver();
}

// checks if an obstacle hit the player
function checkGameOver() {
  let crashed = obstacles.some(function (obstacles) {
    return devGirl.crash(obstacles);
  });

  if (crashed) {
    clearInterval(interval);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 800, 600);
    img = new Image();
    img.src = './images/GAME-OVER.png';
    img.onload = () => ctx.drawImage(img, 250, 200, 300, 170);
    music.stop();
  }
}

function lives() {
  if (devGirl.lives === 3) {
    img = new Image();
    img.src = './images/life2.png';
    ctx.drawImage(img, 20, 20, 30, 30);
    ctx.drawImage(img, 50, 20, 30, 30);
    ctx.drawImage(img, 80, 20, 30, 30);
  }
  if (devGirl.lives === 2) {
    img = new Image();
    img.src = './images/life2.png';
    ctx.drawImage(img, 20, 20, 30, 30);
    ctx.drawImage(img, 50, 20, 30, 30);
  }
  if (devGirl.lives === 1) {
    img = new Image();
    img.src = './images/life2.png';
    ctx.drawImage(img, 20, 20, 30, 30);
  }
  if (devGirl.lives === 0) {
    clearInterval(interval);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 800, 600);
    img = new Image();
    img.src = './images/GAME-OVER.png';
    ctx.drawImage(img, 350, 300, 200, 200);
  }
}

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 38: // up arrow
      devGirl.speedY = -4;
      break;
    case 40: // down arrow
      devGirl.speedY = 4;
      break;
    case 37: // left arrow
      devGirl.speedX = -4;
      break;
    case 39: // right arrow
      devGirl.speedX = 4;
      break;
  }
};

document.onkeyup = function (e) {
  switch (e.keyCode) {
    case 38: // up arrow
      devGirl.speedY = -2;
      break;
    case 40: // down arrow
      devGirl.speedY = 2;
      break;
    case 37: // left arrow
      devGirl.speedX = -2;
      break;
    case 39: // right arrow
      devGirl.speedX = 2;
      break;
  }
};

class Obstacle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 80;
    this.name = name;
  }

  drawObstacle() {
    this.name = 'iAmABug';
    let img = new Image();
    img.src = './images/codebug.png';
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }

  questionMark() {
    this.name = 'iAmAQuestion';
    let questionImg = new Image();
    questionImg.src = './images/questionmark.png';
    ctx.drawImage(questionImg, this.x, this.y, 120, 100);
  }

  updateObstacle() {
    this.x -= 4;
  }
}

// generates obstacles in random positions and takes it out of the array
function createObstacle() {
  if (frames % 100 === 0) {
    const maxPositionY = 400;
    const minPositionY = 100;
    obstacles.push(new Obstacle(800, Math.floor(Math.random() * (maxPositionY - minPositionY)) + minPositionY));
  }
  obstacles.forEach((obst, i) => {
    obst.updateObstacle();
    if (obst.x < 0) {
      obstacles.splice(i, 1);
    }
  });
}

// generates questions in random positions and takes it out of the array
function createQuestion() {
  if (frames % 300 === 0) {
    const maxPositionY = 400;
    const minPositionY = 100;
    questions.push(new Obstacle(850, Math.floor(Math.random() * (maxPositionY - minPositionY)) + minPositionY));
  }
  questions.forEach((quest, i) => {
    quest.updateObstacle();
    if (quest.x < 0) {
      questions.splice(i, 1);
    }
  });
}
