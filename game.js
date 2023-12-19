const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Images
function createImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

// const image = new Image();
// image.src = "_f709b0cd-51a9-49f2-a942-aace1b73fb3e.jfif";
// image.src = "img/background.png";

// Images 
let platformImage = createImage('./img/platform.png');
let platformSmallTallImage = createImage('./img/platformSmallTall.png');
let hills = createImage('./img/hills.png');
let background = createImage('./img/background.png');
// let mars = createImage('./img/mars.jfif');

// Sprite
let spriteRunLeft = createImage('./img/spriteRunLeft.png');
let spriteRunRight = createImage('./img/spriteRunRight.png');
let spriteStandLeft = createImage('./img/spriteStandLeft.png');
let spriteStandRight = createImage('./img/spriteStandRight.png');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2 - 200,
    y: canvas.height - 500,
    width: 66,
    height: 150,
    image: spriteStandRight,
    frame: 0,
    speed: 10,
    jumping: false,
    dy: 0, // Vertical velocity
    jumpPower: 22,
    gravity: 0.5, // Gravity force
};

// Now that 'player' is defined, we can properly assign properties that refer to 'player'.
player.sprites = {
    stand: {
        right: spriteStandRight,
        cropWidth: 177,
        width: player.width, // Now correctly refers to 'player.width'
        left: spriteStandLeft
    },
    run: {
        right: spriteRunRight,
        cropWidth: 341,
        width: 127.875, // Ensure this is the correct value you want for the rendered width
        left: spriteRunLeft
    }
};
player.currentSprite = player.sprites.stand.right; // Now correctly refers to 'player.sprites.stand.right'
player.currentCropWidth = player.sprites.stand.cropWidth;

// Add a property to track the last direction
player.lastDirection = 'right'; // Initial value can be 'right' or 'left'

// Platforms
const platforms = [
    // { x: 50, y: canvas.height - 200, width: 250, height: 10 },
    // { x: 400, y: canvas.height - 300, width: 250, height: 10 },
    // ctx.drawImage(platformImage, 0, 500, 250, 100),
    // { x: 1000, y: canvas.height - 380, width: 250, height: 10 },
    // { x: 2000, y: canvas.height - 580, width: 250, height: 10 },
    // { x: 3000, y: canvas.height - 380, width: 250, height: 10 },
    // { x: 4000, y: canvas.height - 580, width: 250, height: 10 },
    // { x: 5000, y: canvas.height - 380, width: 250, height: 10 },
    // { x: 6000, y: canvas.height - 580, width: 250, height: 10 },
    // { x: 7000, y: canvas.height - 380, width: 250, height: 10 },
    
    { x: 7000, y: canvas.height - 380, width: platformImage.width, height: platformImage.width },
    { x: 7000, y: canvas.height - 380, width: platformImage.width, height: platformImage.width },
    { x: 7000, y: canvas.height - 380, width: platformImage.width, height: platformImage.width },
    { x: 7000, y: canvas.height - 380, width: platformImage.width, height: platformImage.height },
    
    { x: 0, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width - 2, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width * 2 - 3, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width * 3 - 3, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width * 4 - 3, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width * 5 - 3, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width * 6 - 3, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width * 7 - 3, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width * 8 - 3, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width * 9 - 3, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width * 10 - 3, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },
    { x: platformImage.width * 11 - 3, y: canvas.height - 130, width: platformImage.width, height: platformImage.height },

    { x: 0, y: canvas.height - 100, width: 250000, height: 100 },


    // { x: 0, y: canvas.height - 50, width: 1500, height: 10 },
    // { x: 2000, y: canvas.height - 50, width: 1500, height: 10 },
    // { x: 4000, y: canvas.height - 50, width: 1500, height: 10 },
    // { x: 6000, y: canvas.height - 50, width: 1500, height: 10 },
    // { x: 6000, y: canvas.height - 50, width: 15000, height: 10 },
    // Add more platforms as needed
];

// Scrolling Background
let backgroundX = 0; // Initial background X position
const backgroundSpeed = 3; // Speed of background scrolling

// Scrolling Hills
let backgroundX2 = 0; // Initial background X position
const backgroundSpeed2 = 2; // Speed of background scrolling

// Winning Situation
let offSet = 0;

// A function to draw the player character.
function drawPlayer() {
        
   // Draw player sprite
    ctx.drawImage(
        player.currentSprite,
        player.currentCropWidth * player.frame,
        0,
        player.currentCropWidth,
        400,
        player.x, // Corrected from player.position.x
        player.y, // Corrected from player.position.y
        player.width, 
        player.height
    );
}

// A function to draw the player character.
function drawPlatforms() {
    ctx.fillStyle = "green";
    platforms.forEach((platform) => {
      ctx.drawImage(platformImage, platform.x, platform.y, platformImage.width, platformImage.height);
    });
}

// Define a function to update the game's logic.
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Update player frames and sprites
    player.frame++;
    if (player.frame > 59 && (player.currentSprite === player.sprites.stand.right ||
        player.currentSprite === player.sprites.stand.left)
    ) {
        player.frame = 0;
    } else if (
        player.frame > 29 && (
        player.currentSprite === player.sprites.run.right || 
        player.currentSprite === player.sprites.run.left)
        ) {
        player.frame = 0;
    }

    ctx.drawImage(background, backgroundX, 0, background.width, canvas.height);
    // ctx.drawImage(image, backgroundX, 0, image.width, canvas.height);
    // ctx.drawImage(image, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(hills, backgroundX2, 20, hills.width, hills.height);
    ctx.drawImage(hills, backgroundX2+800, 20, hills.width, hills.height);
    // ctx.drawImage(platformImage, 0, canvas.height-platformImage.height, platformImage.width, platformImage.height);
    drawPlayer();
    drawPlatforms();
   
    const leftBound = canvas.width * 0.10; // 10% of the screen width
    const rightBound = canvas.width * 0.60; // 60% of the screen width

    function updatePlayerSprite(spriteType, direction) {
        player.currentSprite = player.sprites[spriteType][direction];
        player.currentCropWidth = player.sprites[spriteType].cropWidth;
        player.width = player.sprites[spriteType].width;
        player.lastDirection = direction;
    }

    // Move the player to the left if within the bounds
    if ((keys["ArrowLeft"] && player.x > leftBound)|| 
    (keys["ArrowLeft"] && offSet === 0 && player.x > 3)) {
    player.x -= player.speed;
    updatePlayerSprite('run', 'left');
    } else if (keys["ArrowLeft"] && player.x <= leftBound && offSet > 0) {
    platforms.forEach(platform => platform.x += player.speed);
    backgroundX += backgroundSpeed;
    backgroundX2 += backgroundSpeed2;
    offSet -= 5;
    updatePlayerSprite('run', 'left');
    } else if (keys["ArrowRight"] && player.x < rightBound) {
    player.x += player.speed;
    updatePlayerSprite('run', 'right');
    } else if (keys["ArrowRight"] && player.x >= rightBound) {
    platforms.forEach(platform => platform.x -= player.speed);
    backgroundX -= backgroundSpeed;
    backgroundX2 -= backgroundSpeed2;

    offSet += 5;
    updatePlayerSprite('run', 'right');
    } else {
        // Key release logic
        updatePlayerSprite('stand', player.lastDirection);
    }
    
    // Handle jumping
    if ((keys["ArrowUp"] || keys[" "]) && !player.jumping) {
        player.jumping = true;
        player.dy = -player.jumpPower; // Jump upwards
    }

    if (offSet > 5000) {
        console.log("You Win")
    }

    // Apply gravity
    player.dy += player.gravity;
    player.y += player.dy;

    // Check collision with platforms
    for (let platform of platforms) {
        // if (player.x <= platform.x + (platform.width-20) &&
        if (player.x <= platform.x + platform.width &&
            // player.x + (player.width/2) >= platform.x &&
            player.x + player.width >= platform.x &&
            player.y + player.height >= platform.y &&
            player.y + player.dy <= platform.y + platform.height) {
                player.jumping = false;
                player.y = platform.y - player.height;
                player.dy = 0;            
        }
    }

    requestAnimationFrame(updateGame);
}

// Create an object to track key presses.
const keys = {};

// Add event listeners to handle key presses.
document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
    
  // Add an event listener for jumping (Space key)
    if (event.key === " ") {
        event.preventDefault(); // Prevent the spacebar from scrolling the page
    }
});

document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// Start the game loop.

// image.onload = function(){

    updateGame();

// }