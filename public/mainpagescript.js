const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
let runGame = false;
let interact = [false, ]; //interaction, category(projects, social med, etc)
canvas.width = 800;
canvas.height = 500;

//Objects
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

const cloudsXAxis = {
    cloud1: 0,
    cloud2: 800
};

const signAxis = {
    projectSign: [30, 380]
};
/////////////////////

//Load Images
const playerSprite = new Image();
playerSprite.src = "../images/pikachu_sprite.png";

const background = new Image();
background.src = "../images/pokemon_beach_base.jpeg";

const clouds = new Image();
clouds.src = "../images/clouds.png";

//Signs
const AboutMeSign = new Image();
AboutMeSign.src = "../images/AboutMeSign.png";

const EducationSign = new Image();
EducationSign.src = "../images/EducationSign.png";

const SkillsSign = new Image();
SkillsSign.src = "../images/SkillsSign.png";

const ProjectSign = new Image();
ProjectSign.src = "../images/ProjectSign.png";

const WorkExperienceSign = new Image();
WorkExperienceSign.src = "../images/WorkExperienceSign.png";

const SocialMediaSign = new Image();
SocialMediaSign.src = "../images/SocialMediaSign.png";
///////////////////////////////////////////////

function loopClouds(speed = 0.5){
    ctx.drawImage(clouds, cloudsXAxis.cloud1, 233, canvas.width, canvas.height/4.8);
    cloudsXAxis.cloud1 -= speed;
    ctx.drawImage(clouds, cloudsXAxis.cloud2, 233, canvas.width, canvas.height/4.8);
    cloudsXAxis.cloud2 -= speed;
    if (cloudsXAxis.cloud1 < -800){
        cloudsXAxis.cloud1 = 0
    }
    if (cloudsXAxis.cloud2 < 0){
        cloudsXAxis.cloud2 = 800
    }
}

//build in canvas attributes to make it simplier
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
    //reference
    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    //5,6 is the location in the canvas
    //last 2 is the width and height in the canvas
};

function drawSigns(sizeX, sizeY){
    ctx.drawImage(AboutMeSign, 0, 0, AboutMeSign.width, AboutMeSign.height, 50, 350, sizeX, sizeY)
    ctx.drawImage(EducationSign, 0, 0, EducationSign.width, EducationSign.height, 150, 350, sizeX, sizeY)
    ctx.drawImage(SkillsSign, 0, 0, SkillsSign.width, SkillsSign.height, 250, 350, sizeX, sizeY)
    ctx.drawImage(ProjectSign, 0, 0, ProjectSign.width, ProjectSign.height, 350, 350, sizeX, sizeY)
    ctx.drawImage(WorkExperienceSign, 0, 0, WorkExperienceSign.width, WorkExperienceSign.height, 450, 350, sizeX, sizeY)
    ctx.drawImage(SocialMediaSign, 0, 0, SocialMediaSign.width, SocialMediaSign.height, 550, 350, sizeX, sizeY)
};

function keyListener(){
    window.addEventListener("keydown", function(e){
        keys[e.key] = true;
        if (e.key === ("w" || "a" || "s" || "d")){
            player.moving = true;
        }
        
        if (e.repeat){
            return
        }
    });
    
    window.addEventListener("keyup", function(e){
        delete keys[e.key];
        player.moving = false;
    })
}

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

//Motion change
function handlePlayerFrame(){
    if (player.frameX < 3 && player.moving == true){
        player.frameX ++;
    }
    else{
        player.frameX = 0;
    }
}

//Tutorial Page
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
                                                        <p>To quickly navigate through each sections, walk your character to the nearest navigation menu and press</p>
                                                        <div id="EnterKeyDisplay"> <h1>Enter↵</h1> </div>
                                                        <p></p>
                                                        <p>If you want to skip the tutorial, feel free to press the "Skip Tutorial" button below. Otherwise, press "Next"</p>
                                                        <button id="nextButton" type="button">Next</button>
                                                        <button id="previousButton" type="button">Previous</button>
                                                        <button id="skipButton" type="button">Skip Tutorial</button>`
    }

    if (counter === 3) {
        document.getElementById("tutorial").innerHTML = `<h3>How to Select</h3>
                                                        <p>To quickly navigate through each sections, walk your character to the nearest navigation sign and press</p>
                                                        <div id="EscapeKeyDisplay"> <h1>Esc</h1> </div>
                                                        <p></p>
                                                        <p>If you want to skip the tutorial, feel free to press the "Skip Tutorial" button below. Otherwise, press "Next"</p>
                                                        <button id="finishButton" type="button">Finish</button>
                                                        <button id="previousButton" type="button">Previous</button>
                                                        <button id="skipButton" type="button">Skip Tutorial</button>`
        document.getElementById("finishButton").onclick = () => {
            document.getElementById("tutorial").style.display = "none";
            runGame = true;
        }
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

        else if (counter === 3){
            if (e.key == "Escape"){
                document.getElementById("EscapeKeyDisplay").style.background = "lightgreen";
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

        else if (counter === 3){
            if (e.key == "Escape"){
                document.getElementById("EscapeKeyDisplay").style.background = "white";
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

//Show textBubble
function createTextBubble (category, heightSize){
    runGame = false;
    interact[0] = true;
    interact[1] = category;
    projects_text_bubble = document.getElementById("text_bubble")
    projects_text_bubble.style.display = "block"
    projects_text_bubble.style.height = heightSize;
}

//Check for interaction, Show pop-up bubbles
function objectInteraction(){
    //About Me
    if ((player.x >= 0 && player.x <= 450) && (335 <= player.y && player.y <= 380) && (keys["Enter"] === true)){
        createTextBubble("About Me", "70%");
        projects_text_bubble.style.position = "fixed";
        projects_text_bubble.innerHTML =`<p class = "AboutMe">About Me</p>
                                        <img src="/images/work pp.jpeg" alt="my picture" style="width:30%;height:30%; align:left">
                                        <h4 class = "AboutMe">Hi there! My name is Fnu William, I graduated from Illinois Institute of technology on May 22, 2012. I majored in Computer Engineering and I am currently looking for a full time job as a software engineer. 
                                        In my experience in programming, I have won Dare Mighty Things hackathon in 2019 for a multi-million dollar company Jones Lang LaSalle (JLL). I also joined Google's Tech Challenge in their Headquarters in Chicago with the theme of "Video Games".
                                        Initially, I was interested in computer engineering because of the ability to combine computer software and hardware together into reality. I first realized my passion in computer engineering after seeing just how many problems in the world espescially underdevelop areas
                                        can be solved by using computer software.</h4>
                                        `
    };

    //Education
    if ((player.x >= 400 && player.x <= 450) && (335 <= player.y && player.y <= 380) && (keys["Enter"] === true)){
        createTextBubble("Education", "70%");
        projects_text_bubble.innerHTML =`<p class = "Education">Education</p>
                                        <ul class = "Education" style= "list-style-type:disc;">
                                        <li class = "Education"><h3 class = "Education">Illinois Institute of Technology</h3> (Graduated May 22, 2021)</li>
                                        <li class = "Education"><h3 class = "Education">Harold Washington College</h3> (Transferred May 2018)</li>
                                        <li class = "Education">Relevant Coursework: 
                                            <ul class = "dashed">
                                                <li>Data Structure and Algorithm (Python)</li>
                                                <li>Accelerated Intro to Computer Science (Java)</li>
                                                <li>Internet of Things and  Cyber-Physical Systems</li>
                                                <li>Database Organization (PostgreSQL)</li>
                                                <li>Software Engineering I</li>
                                                <li>Introduction to Machine Learning</li>
                                            </ul>
                                        </li>`
    };

    //Skills
    if ((player.x >= 350 && player.x <= 399) && (335 <= player.y && player.y <= 380) && (keys["Enter"] === true)){
        createTextBubble("Skills", "70%");
        projects_text_bubble.innerHTML =`<p class = "Skills">Skills</p>
                                        <ul class = "Skills" style= "list-style-type:disc;">
                                            <li class = "Skills">Programming Language:</li>
                                                <ul class = "SkillsSublist">
                                                    <li>Python (Expert)</li>
                                                    <li>Java (Advance)</li>
                                                    <li>Javascript (Advance)</li>
                                                    <li>Node Js (Advance)</li>
                                                    <li>C (Basic)</li>
                                                    <li>Swift (Basic)</li>
                                                    <li>PostgreSQL</li>
                                                    <li>HTML</li>
                                                    <li>CSS</li>
                                                    <li>Autocad</li>
                                                    <li>x86</li>
                                                    <li>MIPS</li>
                                                    <li>Tkinter</li>
                                                    <li>Verilog</li>
                                                    <li>Xilinx</li>
                                                </ul>
                                            <li class = "Skills">Cloud-Based Technology:</li>
                                                <ul class = "SkillsSublist">
                                                    <li>AWS</li>
                                                    <li>Docker</li>
                                                    <li>Sourcetree</li>
                                                    <li>Git/Github</li>
                                                    <li>Firebase</li>
                                                    <li>MongoDb</li>
                                                </ul>
                                        </ul>`
    };

    //Projects
    if ((player.x >= 50 && player.x <= 100) && (335 <= player.y && player.y <= 380) && (keys["Enter"] === true)){
        createTextBubble("Projects", "60%");
        projects_text_bubble.innerHTML =`<p class = "projects">Projects</p>
                                        <ul class = "projects">
                                        <li class = "projects"><i class="arrow"  id = "arrow1"></i>Sudoku Solver</li>
                                        <li class = "projects"><i class="arrow" id = "arrow2"></i>Automated Desk Lamp</li>
                                        <li class = "projects"><i class="arrow" id = "arrow3"></i>Google Tech Challenge</li>
                                        <li class = "projects"><i class="arrow" id = "arrow4"></i>Path Finding Robot</li>
                                        <li class = "projects"><i class="arrow" id = "arrow5"></i>Dare Mighty Things Hackaton</li></ul>`
    };

    //Work Experience
    if ((player.x >= 150 && player.x <= 200) && (335 <= player.y && player.y <= 380) && (keys["Enter"] === true)){
        createTextBubble("Work Experience", "60%");
        projects_text_bubble.innerHTML =`<p class = "workExperience">Work Experience</p>
                                        <h3 class = "workExperience">OpenSlot Solution INC</h4>
                                        <ul class = "workExperience" style= "list-style-type:disc;">
                                        <li class = "workExperience"><i class="bullet" id = "workExperience1"></i>Worked with a team of Developers and product manager to understand featured specs, develop, and test functionality of OpenSlot application (debugging) reducing 60% of the bugs</li>
                                        <li class = "workExperience"><i class="bullet" id = "workExperience2"></i>Identified and documented problems with program function, output, and content to improve quality of product</li>
                                        <li class = "workExperience"><i class="bullet" id = "workExperience3"></i>Designed test plans and procedures with end users which are doctors and dentists by understanding and analyzing functionality of applications to fit business needs</li>
                                        <li class = "workExperience"><i class="bullet" id = "workExperience4"></i>Proposed 15-20 feedbacks and recommendations per week to software developers on usability and functionality to improve application features</li></ul>`
    };

    //Social Media
    if ((player.x >= 250 && player.x <= 300) && (335 <= player.y && player.y <= 380) && (keys["Enter"] === true)){
        createTextBubble("Social Media", "60%");
        projects_text_bubble.innerHTML =`<p class = "SocialMedia">Social Media</p>
                                        <ul class = "SocialMedia">
                                        <li class = "SocialMedia"><i class="arrow" id = "arrow1"></i>Linked In</li>
                                        <li class = "SocialMedia"><i class="arrow" id = "arrow2"></i>Github</li>
                                        <li class = "SocialMedia"><i class="arrow" id = "arrow3"></i>Instagram</li>
                                        <li class = "SocialMedia"><i class="arrow" id = "arrow4"></i>Facebook</li>`
    };
};
//Continue Game
function checkStopInteraction(){
    window.addEventListener("keydown", function(e){
        keys[e.key] = true;
        if (keys["Escape"] === true){
            projects_text_bubble.style.display = "none";
            runGame = true;
            arrowCounter = 1;
            interact[0] = false;
            interact[1] = "";
        }
    });
    window.addEventListener("keyup", function(e){
        delete keys[e.key]
    });
}

//Draw Selection Arrow
let arrowCounter = 1;
async function drawArrow(assignmentType){
    var assignmentSize = {"Projects": 5, "Work Experience": 1, "Education": 2, "Social Media": 4} 
    const half = Math.ceil(assignmentSize[assignmentType] / 2)

    if (await keys["ArrowDown"] === true){
        if ((0 < arrowCounter + 1) && (arrowCounter + 1 < assignmentSize[assignmentType] + 1)){
            projects_text_bubble.getElementsByTagName('i')["arrow" + arrowCounter.toString()].style.display = "none";
            await arrowCounter++;
            projects_text_bubble.getElementsByTagName('i')["arrow" + arrowCounter.toString()].style.display = "inline-block";
        }
    }

    if (await keys["ArrowUp"] === true){
        if ((0 < arrowCounter - 1) && (arrowCounter - 1 < assignmentSize[assignmentType] + 1)){
            projects_text_bubble.getElementsByTagName('i')["arrow" + arrowCounter.toString()].style.display = "none";
            arrowCounter --;
            projects_text_bubble.getElementsByTagName('i')["arrow" + arrowCounter.toString()].style.display = "inline-block";
        }
    }

    if (await keys["ArrowRight"] === true){
        if ((0 < arrowCounter + half) && (arrowCounter + half < assignmentSize[assignmentType] + 1)){
            projects_text_bubble.getElementsByTagName('i')["arrow" + arrowCounter.toString()].style.display = "none";
            arrowCounter += half;
            projects_text_bubble.getElementsByTagName('i')["arrow" + arrowCounter.toString()].style.display = "inline-block";
        }
    }

    if (await keys["ArrowLeft"] === true){
        if ((0 < arrowCounter - half) && (arrowCounter - half < assignmentSize[assignmentType] + 1)){
            projects_text_bubble.getElementsByTagName('i')["arrow" + arrowCounter.toString()].style.display = "none";
            arrowCounter -= half;
            projects_text_bubble.getElementsByTagName('i')["arrow" + arrowCounter.toString()].style.display = "inline-block";
        }
    }
};

//Router
function router(category, arrowPointer){
    //Projects
    var getSudokuSolver = function(e){
        if (category === "Projects"){
            if ((keys["Enter"] === true) && (arrowPointer === 1)){
                console.log("e.key")
                // window.location.href = '/login';
                window.location.href = "/login";
            }
        }
        window.removeEventListener("keydown", getSudokuSolver, false)
    };
    window.addEventListener("keydown", getSudokuSolver);

    //Social Media
    var getLinkedIn = function(e){
        if (category === "Social Media"){
            if ((e.key === "Enter") && (arrowPointer === 1)){
                window.location.href = 'https://www.linkedin.com/in/wwilliam1908/';
            }
        }
        window.removeEventListener("keydown", getLinkedIn, false)
    };
    window.addEventListener("keydown", getLinkedIn);

    var getGithub = function(e){
        if (category === "Social Media"){
            if ((e.key === "Enter") && (arrowPointer === 2)){
                window.location.href = 'https://github.com/wwilliam98';
            }
        }
        window.removeEventListener("keydown", getGithub, false);
    };
    window.addEventListener("keydown", getGithub);

    var getInstagram = function(e){
        if (category === "Social Media"){
            if ((e.key === "Enter") && (arrowPointer === 3)){
                window.location.href = 'https://www.instagram.com/wwilliam_98/';
            }
        }
        window.removeEventListener("keydown", getInstagram, false);
    };
    window.addEventListener("keydown", getInstagram);

    var getFacebook = function(e){
        if (category === "Social Media"){
            if ((e.key === "Enter") && (arrowPointer === 4)){
                window.location.href = 'https://www.facebook.com/wwilliam1908';
            }
        }
        window.removeEventListener("keydown", getFacebook, false);
    };
    window.addEventListener("keydown", getFacebook);
}

let fps, fpsInterval, startTime, now, then, elapsed;
function startAnimating(fps){
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}

nextPreviousTutorial()
async function animate(){
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);

        //code
        keyListener();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        loopClouds();
        drawSigns(70, 70);
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
        if (runGame === true){
            movePlayer();
            handlePlayerFrame();
            objectInteraction();
        }
        if (interact[0] === true){
            await drawArrow(interact[1]);
            checkStopInteraction();
            router(interact[1], arrowCounter);
        }
    }
}

startAnimating(17);