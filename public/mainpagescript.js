const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
let runGame = false;
canvas.width = 800;
canvas.height = 500;

const keys = [];
const player = {
    x: 0,
    y: 400,
    width: 64,
    height: 64,
    frameX: 0,
    frameY: 0,
    speed: 5,
    moving: false
};

const cloudsAxis = {
    cloud1: 0,
    cloud2: 800
};

const playerSprite = new Image();
playerSprite.src = "../images/pikachu_sprite.png";

const background = new Image();
background.src = "../images/pokemon_beach_base.jpeg";

const clouds = new Image();
clouds.src = "../images/clouds.png";

//build in canvas attributes to make it simplier
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
};

window.addEventListener("keydown", function(e){
    keys[e.key] = true;
    if (e.key === ("w" || "a" || "s" || "d")){
        player.moving = true;
    }
});

window.addEventListener("keyup", function(e){
    delete keys[e.key];
    player.moving = false;
})

function movePlayer(){
    if ((keys["ArrowUp"] || keys["w"] == true)){
        player.frameY = 3;
        player.moving = true;
        if (player.y >= 340){
            player.y -= player.speed;
        }
        
    }
    if (keys["ArrowDown"] || keys["s"] == true){
        player.frameY = 0;
        player.moving = true;
        if (player.y < 440){
            player.y += player.speed;
        }
    }
    if (keys["ArrowLeft"] || keys["a"] == true){
        player.frameY = 1;
        player.moving = true;
        if (player.x > -15){
            player.x -= player.speed;
        }
    }
    if (keys["ArrowRight"] || keys["d"] == true){
        player.frameY = 2;
        player.moving = true;
        if (player.x < 750){
            player.x += player.speed;
        }
    }

    // check user coordinate
    if (player.moving){
        console.log(player.x, player.y)
    }
}

function handlePlayerFrame(){
    if (player.frameX < 3 && player.moving == true){
        player.frameX ++
    }
    else{
        player.frameX = 0;
    }
}

let counter = 1;
function nextPreviousTutorial(){
    if (counter === 1) {
        document.getElementById("tutorial").innerHTML = `<h3>Welcome to my Website!</h3>
                                                        <p>First, get familiar with moving around the landscape. You can move the character around by pressing</p>
                                                        <div id="WKeyDisplay"> <h1>W</h1> </div>
                                                        <div id="AKeyDisplay"> <h1>A</h1> </div>
                                                        <div id="SKeyDisplay"> <h1>S</h1> </div>
                                                        <div id="DKeyDisplay"> <h1>D</h1> </div>
                                                        <p></p>
                                                        <p>If you want to skip the tutorial, you can always press the "Skip Tutorial" button below. Otherwise, press "Next"</p>
                                                        <button id="nextButton" type="button">Next</button>
                                                        <button id="previousButton" type="button">Previous</button>
                                                        <button id="skipButton" type="button">Skip Tutorial</button>`;
    }

    if (counter === 2) {
        document.getElementById("tutorial").innerHTML = `<h3>Site Menu?</h3>
                                                        <p>To quickly navigate through each sections, walk your character to the nearest navigation sign and press</p>
                                                        <div id="EnterKeyDisplay"> <h1>Enter↵</h1> </div>
                                                        <p></p>
                                                        <p>If you want to skip the tutorial, feel free to press the "Skip Tutorial" button below. Otherwise, press "Next"</p>
                                                        <button id="nextButton" type="button">Next</button>
                                                        <button id="previousButton" type="button">Previous</button>
                                                        <button id="skipButton" type="button">Skip Tutorial</button>`
    }


    window.addEventListener("keydown", function(e){
        if (counter === 1){
            if (e.key == "w"){
                document.getElementById("WKeyDisplay").style.background = "lightgreen";
            }
            if (e.key == "a"){
                document.getElementById("AKeyDisplay").style.background = "lightgreen";
            }
            if (e.key == "s"){
                document.getElementById("SKeyDisplay").style.background = "lightgreen";
            }
            if (e.key == "d"){
                document.getElementById("DKeyDisplay").style.background = "lightgreen";
            }
        }
        else if (counter === 2){
            if (e.key == "Enter"){
                document.getElementById("EnterKeyDisplay").style.background = "lightgreen";
            }
        }
    });
    
    window.addEventListener("keyup", function(e){
        if (counter === 1){
            if (e.key == "w"){
                document.getElementById("WKeyDisplay").style.background = "white";
            }
            if (e.key == "a"){
                document.getElementById("AKeyDisplay").style.background = "white";
            }
            if (e.key == "s"){
                document.getElementById("SKeyDisplay").style.background = "white";
            }
            if (e.key == "d"){
                document.getElementById("DKeyDisplay").style.background = "white";
            }
        }
        else if (counter === 2){
            if (e.key == "Enter"){
                document.getElementById("EnterKeyDisplay").style.background = "white";
            }
        }
    })

    document.getElementById("skipButton").onclick = () => {
        document.getElementById("tutorial").style.display = "none";
        runGame = true;
    }

    if (document.getElementById("nextButton")) {
        document.getElementById("nextButton").onclick = () => {
          if (counter < 3) counter++;
          nextPreviousTutorial();
        }
      }
    
    document.getElementById("previousButton").onclick = () => {
        if (counter > 1) counter--;
        nextPreviousTutorial();
    }
}

// function animate(){
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     // ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
//     drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
//     movePlayer();
//     handlePlayerFrame();
//     requestAnimationFrame(animate);
// }

// animate();
function loopClouds(speed = 0.5){
    ctx.drawImage(clouds, cloudsAxis.cloud1, 233, canvas.width, canvas.height/4.8);
    cloudsAxis.cloud1 -= speed;
    ctx.drawImage(clouds, cloudsAxis.cloud2, 233, canvas.width, canvas.height/4.8);
    cloudsAxis.cloud2 -= speed;
    if (cloudsAxis.cloud1 < -800){
        cloudsAxis.cloud1 = 0
    }
    if (cloudsAxis.cloud2 < 0){
        cloudsAxis.cloud2 = 800
    }
}

nextPreviousTutorial()
setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height) 
        loopClouds();
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
        if (runGame === true){
            movePlayer();
            handlePlayerFrame();
        }
}, 60);