const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const image = new Image();
image.src = "_f709b0cd-51a9-49f2-a942-aace1b73fb3e.jfif";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2 - 200,
    y: canvas.height - 500,
    width: 50,
    height: 50,
    speed: 10,
    jumping: false,
    dy: 0, // Vertical velocity
    jumpPower: 20,
    gravity: 0.5, // Gravity force
};

// scrolling background

let backgroundX = 0; // Initial background X position
const backgroundSpeed = 3; // Speed of background scrolling

const platforms = [
    { x: 50, y: canvas.height - 200, width: 200, height: 10 },
    { x: 400, y: canvas.height - 300, width: 200, height: 10 },
    { x: 650, y: canvas.height - 580, width: 200, height: 10 },
    // Add more platforms as needed
];

// A function to draw the player character.
function drawPlayer() {
  ctx.fillStyle = "blue"; // Player color
  ctx.fillRect(player.x, player.y, player.width, player.height);
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
    ctx.drawImage(image, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(image, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    drawPlayer();
    drawPlatforms();

    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
        backgroundX += backgroundSpeed; // Scroll background to the left when player moves right
    }
    if (keys["ArrowRight"] && player.x + player.width < canvas.width) {
        player.x += player.speed;
        backgroundX -= backgroundSpeed; // Scroll background to the left when player moves right
    }

    // Handle jumping
    if ((keys["ArrowUp"] || keys[" "]) && !player.jumping) {
        player.jumping = true;
        player.dy = -player.jumpPower; // Jump upwards
    }

    // Apply gravity
    player.dy += player.gravity;
    player.y += player.dy;

    // Check collision with ground
    if (player.y >= canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.jumping = false;
    }

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
