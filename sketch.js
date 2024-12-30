let sprites = {
  idle: {
    img: null,
    width: 2056 / 9,
    height: 159,
    frames: 9
  },
  walk: {
    img: null,
    width: 1732 / 9,
    height: 233,
    frames: 9
  },
  jump: {
    img: null,
    width: 2185 / 10,
    height: 317,
    frames: 10
  },
  idle2: {
    img: null,
    width: 1339 / 8,
    height: 186,
    frames: 8
  },
  walk2: {
    img: null,
    width: 1187 / 8,
    height: 237,
    frames: 8
  },
  jump2: {
    img: null,
    width: 990 / 5,
    height: 135,
    frames: 5
  }
};

let characters = [
  {
    x: 200,
    y: 200,
    speedX: 15,
    speedY: 0,
    gravity: 0.8,
    jumpForce: -10,
    isJumping: false,
    groundY: 300,
    currentFrame: 0,
    currentAction: 'idle',  // 使用 'idle' 表示角色1的當前動作
    direction: 1,
    health: 100,
    height: sprites['idle'].height // 設定角色的高度
  },
  {
    x: 400,
    y: 200,
    speedX: 15,
    speedY: 0,
    gravity: 0.8,
    jumpForce: -10,
    isJumping: false,
    groundY: 300,
    currentFrame: 0,
    currentAction: 'idle2',  // 使用 'idle2' 表示角色2的當前動作
    direction: 1,
    health: 100,
    height: sprites['idle2'].height // 設定角色的高度
  }
];

let backgroundImg; // 定義背景圖片變數
let bullets = []; // 儲存子彈的陣列

function preload() {
  // 載入精靈圖
  sprites.idle.img = loadImage('idle.png');
  sprites.walk.img = loadImage('walk.png');
  sprites.jump.img = loadImage('jump.png');
  
  sprites.idle2.img = loadImage('idle2.png');
  sprites.walk2.img = loadImage('walk2.png');
  sprites.jump2.img = loadImage('jump2.png');

  // 載入背景圖片
  backgroundImg = loadImage('background.png', 
    () => console.log('Background image loaded'), 
    () => console.log('Failed to load background image')
  ); // 確保這裡的路徑正確
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(12); // 設定動畫速度
}

function draw() {
  // 繪製背景圖片，填滿整個畫布
  if (backgroundImg) {
    image(backgroundImg, 0, 0, width, height); // 繪製背景，填滿整個畫布
  } else {
    background(220); // 如果背景圖片未加載，顯示灰色背景
  }
  
  // 更新物理運動
  characters.forEach(character => updatePhysics(character));
  
  // 繪製角色
  characters.forEach(character => drawCharacter(character));
  
  // 檢查鍵盤輸入
  checkKeys();

  // 繪製角色的血量條
  characters.forEach(character => drawHealthBar(character));

  // 更新和繪製子彈
  bullets.forEach((bullet, index) => {
    bullet.update();
    bullet.display();
    // 檢查子彈是否碰到角色
    characters.forEach(character => {
      if (bullet.hits(character)) {
        character.health -= 10; // 扣除生命值
        bullets.splice(index, 1); // 移除子彈
      }
    });
  });
}

function drawCharacter(character) {
  let currentSprite;

  // 根據角色動作和方向選擇精靈圖
  if (character.currentAction === 'idle') {
    currentSprite = sprites.idle;
  } else if (character.currentAction === 'walk') {
    currentSprite = sprites.walk;
  } else if (character.currentAction === 'jump') {
    currentSprite = sprites.jump;
  } else if (character.currentAction === 'idle2') {
    currentSprite = sprites.idle2;
  } else if (character.currentAction === 'walk2') {
    currentSprite = sprites.walk2;
  } else if (character.currentAction === 'jump2') {
    currentSprite = sprites.jump2;
  }

  // 更新當前幀
  character.currentFrame = (character.currentFrame + 1) % currentSprite.frames;

  // 計算精靈圖的位置
  let sx = character.currentFrame * currentSprite.width;

  // 根據方向繪製精靈圖
  push();
  translate(character.x + (character.direction === -1 ? currentSprite.width : 0), character.y);
  scale(character.direction, 1);  // 依據方向鏡像翻轉角色
  image(currentSprite.img, 
    0, 0,                                     // 畫布上的位置
    currentSprite.width, currentSprite.height, // 顯示的寬度與高度
    sx, 0,                                    // 精靈圖的起始位置
    currentSprite.width, currentSprite.height  // 精靈圖的裁切大小
  );
  pop();
}

function updatePhysics(character) {
  // 應用重力
  if (character.y < character.groundY) {
    character.speedY += character.gravity;
    character.isJumping = true;
  }

  // 更新垂直位置
  character.y += character.speedY;

  // 檢查是否著地
  if (character.y >= character.groundY) {
    character.y = character.groundY;
    character.speedY = 0;
    character.isJumping = false;
  }

}

function checkKeys() {
  // 控制角色的移動和跳躍
  handleCharacterMovement(characters[0], RIGHT_ARROW, LEFT_ARROW, UP_ARROW, 'walk', 'idle');
  handleCharacterMovement(characters[1], 68, 65, 87, 'walk2', 'idle2'); // D, A, W 鍵
  
  // 更新角色2的行為
  if (keyIsDown(83)) { // S 鍵
    characters[1].currentAction = 'walk2'; // 設置為 walk2
  }
  if (keyIsDown(87)) { // W 鍵
    characters[1].currentAction = 'idle2'; // 設置為 idle2
  }
  if (keyIsDown(65) || keyIsDown(68)) { // A 或 D 鍵
    characters[1].currentAction = 'jump2'; // 設置為 jump2
  }
}

function handleCharacterMovement(character, rightKey, leftKey, jumpKey, walkAction, idleAction) {
  if (keyIsDown(rightKey)) {
    character.x += character.speedX;
    character.currentAction = walkAction;
    character.direction = 1;
  } else if (keyIsDown(leftKey)) {
    character.x -= character.speedX;
    character.currentAction = walkAction;
    character.direction = -1;
  } else if (!character.isJumping) {
    character.currentAction = idleAction;
  }

  // 跳躍控制
  if (keyIsDown(jumpKey) && !character.isJumping) {
    character.speedY = character.jumpForce;
    character.currentAction = (walkAction === 'walk') ? 'jump' : 'jump2';
    character.isJumping = true;
  }
}
function drawHealthBar(character) {
  // 設定血量條的顏色和位置
  fill(255, 0, 0); // 紅色
  rect(character.x - 10, character.y - 20, 40, 5); // 背
}

function keyPressed() {
  if (key === ' ') { // 角色1發射子彈
    bullets.push(new Bullet(characters[0]));
  }
  
  if (key === 'f') { // 角色2發射子彈（使用 'F' 鍵）
    bullets.push(new Bullet(characters[1]));
  }
}

class Bullet {
  constructor(character) {
    this.x = character.x + 20; // 從角色的中間發射
    this.y = character.y + character.height / 2; // 從角色的中間高度發射
    this.speed = 10;
    this.direction = character.direction; // 獲取角色的方向
    this.size = 10; // 增加子彈的大小
  }

  update() {
    this.x += this.speed * this.direction; // 根據方向更新位置
  }

  display() {
    fill(255, 0, 0); // 使用紅色填充
    stroke(0); // 添加黑色邊框
    strokeWeight(2); // 邊框的厚度
    ellipse(this.x, this.y, this.size, this.size); // 繪製更大的子彈
  }

  hits(character) {
    return (this.x > character.x && this.x < character.x + 40 && this.y > character.y - 20 && this.y < character.y);
  }
}
