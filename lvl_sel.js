let levels = 5;
let colors = ["red", "blue", "orange", "green", "purple"];
let select = {
    draw() {
        fill("white");
        textStyle(BOLD);
        textFont('Georgia');
        textSize(42);
        text("Level Select", width / 2, height / 8);
        textStyle(NORMAL);
        textFont('Courier New');
        rectMode(CENTER);
        for(let i = 0; i < levels; i++) {
            fill(colors[i]);
            rect(width / 2, height / 4 + height / (levels * 1.5) * i, width / 4, height / (levels * 2));
            fill("white");
            text("Stage " + (i + 1), width / 2, height / 4 + height / (levels * 1.5) * i);
        }
    }
};