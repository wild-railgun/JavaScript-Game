const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const image = new Image();
// image.src = "_f709b0cd-51a9-49f2-a942-aace1b73fb3e.jfif";
image.src = "img/background.png";

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
    sprites: {
        stand: {
            right: spriteStandRight,
            cropWidth: 177,
            width: this.width,
            left: spriteStandLeft
        },
        run: {
            right: spriteRunRight,
            cropWidth: 341,
            width: 127.875,
            left: spriteRunLeft
        }
    },
    currentSprite: sprites.stand.right,
    currentCropWidth: 177,
    speed: 10,
    jumping: false,
    dy: 0, // Vertical velocity
    jumpPower: 22,
    gravity: 0.5, // Gravity force
};

// Platforms
const platforms = [
    { x: 50, y: canvas.height - 200, width: 250, height: 10 },
    { x: 400, y: canvas.height - 300, width: 250, height: 10 },
    { x: 1000, y: canvas.height - 380, width: 250, height: 10 },
    { x: 2000, y: canvas.height - 580, width: 250, height: 10 },
    { x: 3000, y: canvas.height - 380, width: 250, height: 10 },
    { x: 4000, y: canvas.height - 580, width: 250, height: 10 },
    { x: 5000, y: canvas.height - 380, width: 250, height: 10 },
    { x: 6000, y: canvas.height - 580, width: 250, height: 10 },
    { x: 7000, y: canvas.height - 380, width: 250, height: 10 },
    { x: 0, y: canvas.height - 50, width: 1500, height: 10 },
    { x: 2000, y: canvas.height - 50, width: 1500, height: 10 },
    { x: 4000, y: canvas.height - 50, width: 1500, height: 10 },
    { x: 6000, y: canvas.height - 50, width: 1500, height: 10 },
    // Add more platforms as needed
];

// Scrolling Background
let backgroundX = 0; // Initial background X position
const backgroundSpeed = 3; // Speed of background scrolling

// Winning Situation
let offSet = 0;

// A function to draw the player character.
function drawPlayer() {
        player.frames++;
        if (player.frames > 59 && (player.currentSprite === player.sprites.stand.right ||
            player.currentSprite === player.sprites.stand.left)
        ) {
            player.frames = 0;
        } else if (
            player.frames > 29 && (
            player.currentSprite === player.sprites.run.right || 
            player.currentSprite === player.sprites.run.left)
            ) {
            player.frames = 0;
        }
    
//    ctx.fillStyle = "blue"; // Player color
//    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// A function to draw the player character.
function drawPlatforms() {
    ctx.fillStyle = "green";
    platforms.forEach((platform) => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

// Define a function to update the game's logic.
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        player.currentSprite,
        player.currentCropWidth * player.frames,
        0,
        player.currentCropWidth,
        400,
        player.position.x, 
        player.position.y, 
        player.width, 
        player.height
    )
    ctx.drawImage(image, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(image, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    drawPlayer();
    drawPlatforms();

    const leftBound = canvas.width * 0.10; // 10% of the screen width
    const rightBound = canvas.width * 0.60; // 60% of the screen width

    // Move the player to the left if within the bounds
    if ((keys["ArrowLeft"] && player.x > leftBound)|| 
    (keys["ArrowLeft"] && offSet === 0 && player.x > leftBound)) {
    player.x -= player.speed;
    }

    // Scroll the world to the right if the player hits the left bound
    else if (keys["ArrowLeft"] && player.x <= leftBound && offSet > 0) {
    platforms.forEach(platform => platform.x += player.speed);
    backgroundX += backgroundSpeed;
    offSet -= 5
    }

    // Move the player to the right if within the bounds
    if (keys["ArrowRight"] && player.x < rightBound) {
    player.x += player.speed;
    }
    // Scroll the world to the left if the player hits the right bound
    else if (keys["ArrowRight"] && player.x >= rightBound) {
    platforms.forEach(platform => platform.x -= player.speed);
    backgroundX -= backgroundSpeed;
    offSet += 5
    }

    if (offSet > 5000) {
        console.log("You Win")
    }


    /*
    // Move the player left or right within the bounds
    if (keys["ArrowLeft"] && player.x > leftBound) {
        player.x -= player.speed;
    }
    else if (keys["ArrowRight"] && player.x < rightBound) {
        player.x += player.speed;
    }

    // If the player reaches the bounds, scroll the background and platforms
    if ((keys["ArrowLeft"] && player.x <= leftBound) ||
        (keys["ArrowRight"] && player.x >= rightBound)) {
        const scrollDirection = keys["ArrowLeft"] ? 1 : -1;
        platforms.forEach(platform => platform.x += player.speed * scrollDirection);
        backgroundX += backgroundSpeed * scrollDirection;
    }
    */
    // Handle jumping
    if ((keys["ArrowUp"] || keys[" "]) && !player.jumping) {
        player.jumping = true;
        player.dy = -player.jumpPower; // Jump upwards
    }
    

    // Apply gravity
    player.dy += player.gravity;
    player.y += player.dy;

    // Check collision with ground
    // if (player.y >= canvas.height - player.height) {
        // player.y = canvas.height - player.height;
        // player.jumping = false;
    // }

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

    /*
    // Check collision with platforms from top and from below as well

    for (let platform of platforms) {
        // Horizontal overlap
        if (player.x + player.width > platform.x && player.x < platform.x + platform.width) {
            
            // Landing on top of the platform from above
            if (player.dy > 0 && 
                player.y + player.height >= platform.y && 
                player.y + player.height - player.dy <= platform.y
                ) {
                    player.jumping = false;
                    player.y = platform.y - player.height; 
                    player.dy = 0;
            }
            
            // Hitting the platform's bottom from below
            else if (player.dy < 0 && 
                    player.y + player.dy <= platform.y + platform.height &&
                    player.y >= platform.y + platform.height) {
                        player.dy = 0;
                        player.y = platform.y + platform.height;
            }
        }
    }
    */

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

image.onload = function(){

    updateGame();

}