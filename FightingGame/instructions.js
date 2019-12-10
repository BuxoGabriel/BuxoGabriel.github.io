let tleft = ["Q", "W", "E"];
let ldown = ["A", "", "D"];
let tright = ["U", "I", "O"];
let rdown = ["J", "", "L"];
let p1k = ["Q: Shield", "W: Jump", "E: Special Power", "A: Move to the Left", "D: Move to the Right"];
let p2k = ["O: Shield", "I: Jump", "U: Special Power", "J: Move to the Left", "L: Move to the Right"];
let instructions =  {
    draw() {
        textStyle(NORMAL);
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(16);
        textFont('Courier New');
        text("Welcome to our fighting game! The goal of this game is to inflict damage upon your opponenent's health within the time limit provided!", width*0.5, height*0.1);
        text("Click anywhere to continue!", width*0.5, height*0.2);
        textSize(18);
        textStyle(BOLD);
        text("Controls:", width*0.5, height*0.3);
        text("Player 1:", width*0.2, height*0.4);
        text("Player 2:", width*0.8, height*0.4);
        rectMode(CENTER);
        for (let i = 0; i < 3; i++) {
            noFill();
            stroke(255);
            square(width*(0.1+(0.05*i)), height*0.5, 50, 10, 10);
            textStyle(NORMAL);
            fill(255);
            text(tleft[i], width*(0.1+(0.05*i)), height*0.5);
        }
        for (let i = 0; i < 3; i++) {
            noFill();
            stroke(255);
            square(width*(0.125+(0.05*i)), height*0.6, 50, 10, 10);
            textStyle(NORMAL);
            fill(255);
            text(ldown[i], width*(0.125+(0.05*i)), height*0.6);
        }
        textSize(18);
        for (let i = 0; i < 3; i++) {
            noFill();
            stroke(255);
            square(width*(0.7+(0.05*i)), height*0.5, 50, 10, 10);
            textStyle(NORMAL);
            fill(255);
            text(tright[i], width*(0.7+(0.05*i)), height*0.5);
        }
        for (let i = 0; i < 3; i++) {
            noFill();
            stroke(255);
            square(width*(0.725+(0.05*i)), height*0.6, 50, 10, 10);
            fill(255);
            text(rdown[i], width*(0.725+(0.05*i)), height*0.6);
        }
        textSize(16);
        for (let i = 0; i < 5; i++) {
            text(p1k[i], width*0.15, height*(0.7 + (0.05*i)));
            text(p2k[i], width*0.8, height*(0.7 + (0.05*i)));
        }
        noStroke();
    }
};