const chars = 2;
let characters = ["Ren", "Kyu"];
let colours = ["red", "blue"]
let char = {
 draw() {
        background(0);
        textStyle(NORMAL);
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(24);
        textStyle(BOLD);
        textFont('Georgia');
        textSize(42);
        text("Characters", width*0.5, height*0.2);
        textSize(20);
        textStyle(NORMAL);
        textSize(20);
        text(`Player ${player} Select A Character:`, width*0.5, height*0.3);
        textFont('Courier New');
        textStyle(BOLD);
        rectMode(CENTER);
        for (let i = 0; i < chars; i++) {
            fill(colours[i])
            rect(width / 2, height*0.45 + height / (5 * 1.5) * i, width / 4, height / (5 * 2));
            fill("white");
            text(characters[i], width / 2, height*0.45 + height / (5 * 1.5) * i);
        }
    }
}