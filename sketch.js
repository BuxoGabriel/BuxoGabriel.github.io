////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Global Variables
let activeStage = "start";
let stages = {};
let players = []; // make it later so that there can be more players
let g = 0.0001; // gravity is good
let ch = 0.1; //0.1 character height is good
let p1;
let p2;
let timer;
let interval;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//setup p5 Function contains all startup code except global variables.
function setup() {
    //creates the canvas
    createCanvas(windowWidth * 0.95, windowHeight * 0.9);
    rectMode(CENTER);

//Game Start Button
    stages.start = {
        name: "start",
        box: new Platform(0.5, 0.5, 0.25, .25),
        draw: function () {
            rectMode(CENTER);
            fill('red');
            rect(this.box.x, this.box.y, this.box.len, this.box.height);
            textSize(42);
            textAlign(CENTER, CENTER);
            fill("black");
            text("Play", this.box.x, this.box.y);
        }
    };

//Instructions Page
    stages.instructions = instructions;

    stages.stage1 = new Stage("red", [
        new Platform(0.5, 0.99, 1, 0.02),
        new Platform(0.2, 0.65, 0.3, 0.03),
        new Platform(0.8, 0.65, 0.3, 0.03)
        ]);

    stages.stage2 = new Stage("blue", [
        new Platform(0.5, 0.99, 1, 0.02),
        new Platform(0.5, 0.6, 0.3, 0.03),
        new Platform(0.1, 0.6, 0.3, 0.03),
        new Platform(0.9, 0.6, 0.3, 0.03)
        ]);

    stages.stage3 = new Stage("orange", [
        new Platform(0.5, 0.99, 1, 0.02),
        new Platform(0.5, 0.5, 0.2, 0.02),
        new Platform(0.9, 0.8, 0.3, 0.03),
        new Platform(0.1, 0.2, 0.3, 0.03)
        ]);

    stages.stage4 = new Stage("green", [
        new Platform(0.5, 0.99, 1, 0.02),
        new Platform(0.1, 0.3, 0.2, 0.02),
        new Platform(0.9, 0.7, 0.2, 0.02)
        ]/*, true, [1, 2]*/);


    stages.stage5 = new Stage("yellow", [
        new Platform(0.5, 0.99, 1, 0.02),
        new Platform(0.5, 0.5, 0.1, 0.02),
        new Platform(0.1, 0.3, 0.1, 0.02),
        new Platform(0.9, 0.7, 0.1, 0.02)
        ]/*, true, [2, 3, 4]*/);
    stages.win = {
        draw() {
            let winner;
            background(0);
            textSize(100);
            textAlign(CENTER, TOP);
            textFont('Georgia');
            fill (random(255), random(255), random(255));
            if(p1.chealth === p2.chealth) {
                text(`TIE!`, width / 2, height * 0.1);
            }
            else {
                if (p1.chealth < p2.chealth) winner = 2;
                else if (p1.chealth > p2.chealth) winner = 1;
                text(`PLAYER ${winner} WINS!`, width / 2, height * 0.1);
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//draw function
function draw() {
    background('black');
    stages[activeStage].draw();
    //stages[activeStage].moving();
    if(activeStage.startsWith("stage")) {
        p1.shieldOn = false;
        p2.shieldOn = false;
        //Player1 Inputs
        if((keyIsDown(65) && keyIsDown(68)) || (!keyIsDown(65) && !keyIsDown(68))) p1.x_vel = 0;
        else if(keyIsDown(65)) { // A, p1 to the right
            p1.x_vel = -5;
            p1.facing = -1;
        }
        else if(keyIsDown(68)) { // D, p1 to the right
            p1.x_vel = 5;
            p1.facing = 1;
        }
        if(keyIsDown(87) && p1.onGround()) p1.y_vel = -8; // W, p1 jump
        if(keyIsDown(69)) p1.blast(); // E, p1 blast
        if(keyIsDown(81) && !p1.shieldCool) p1.shield(); // Q, p1 shield

        //Player2 Inputs
        if((keyIsDown(74) && keyIsDown(76)) || (!keyIsDown(74) && !keyIsDown(76))) p2.x_vel = 0;
        else if(keyIsDown(74)) { // J, p2 to the right
            p2.x_vel = -5;
            p2.facing = -1;
        }
        else if(keyIsDown(76)) { // L, p2 to the left
            p2.x_vel = 5;
            p2.facing = 1;
        }
        if(keyIsDown(73) && p2.onGround()) p2.y_vel = -8; // I, p2 jump
        if(keyIsDown(85)) p2.blast(); // U, p2 blast
        if(keyIsDown(79) && !p2.shieldCool) p2.shield(); // O, p2 shield

        //processies for both chars
        players.forEach((char) => {
            char.move();
            char.draw();
            char.gravity();
            char.specials.forEach((special, index) => {
                special.draw();
                if(special.hits()) char.specials.splice(index, 1);
            });

            if(char.chealth <= 0) {
                activeStage = "win";
                return undefined;
            }
        });

        //healthbars
        rectMode(CORNERS);
        fill("red");
        rect(width * 0.05, height * 0.05, width * 0.3, height * 0.07);
        fill("green");
        rect(width * 0.05, height * 0.05, width * (0.05 + 0.25 * p1.chealth / p1.health), height * 0.07);

        fill("red");
        rect(width * 0.95, height * 0.05, width * 0.7, height * 0.07);
        fill("green");
        rect(width * 0.95, height * 0.05, width * (0.95 - 0.25 * p2.chealth / p2.health), height * 0.07);

        textAlign(CENTER);
        textSize(30);
        fill("white");
        text(timer, width / 2, height * 0.1);

        if (timer <= 0) {
            clearInterval(interval);
            activeStage = "win";
        }

    }
}

function mousePressed() {
    let start = stages.start.box;                       //bottom                    top                                 left                                right
    if(activeStage === "start" && mouseY <= start.y + start.height / 2 && mouseY >= start.y - start.height / 2 && mouseX >= start.x - start.len / 2 && mouseX <= start.x + start.len / 2) {
        activeStage = "instructions";
        setTimeout(() => {
            activeStage = "stage1";
            players.push(new Fighter1(0.2, 0.3, ch, 1));
            p1 = players[0];
            players.push(new Fighter1(0.8, 0.3, ch, -1));
            p2 = players[1];
            ////////////////////
            timer = 99;
            interval = setInterval(function() {
                timer--;
            }, 1000);
        }, 5000)
    }
}