////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//classes definition
//platform class takes platx, y, length, and width as percentages of the screen size
class Platform {
    constructor(platformX, platformY, platformLength, platformWidth, movesStartsBounds) {
        this.x = platformX * width;
        this.y = platformY * height;
        this.len = platformLength * width;
        this.height = platformWidth * height;
        this.movesStartsBounds = movesStartsBounds;
    }
}

//stage takes an array of platforms
class Stage {
    constructor(color, platforms) {
        this.color = color;
        this.platforms = platforms;
        }
    draw() {
        rectMode(CENTER);
        for(let plat of this.platforms) {
            fill(this.color);
            rect(plat.x, plat.y, plat.len, plat.height);
            if(plat.movesStartsBounds[0]) {
                if(plat.x <= plat.movesStartsBounds[2][0] * width || plat.x >= plat.movesStartsBounds[2][1] * width) plat.movesStartsBounds[1] *= -1;
                plat.x += (g * width * 10 * plat.movesStartsBounds[1]);
            }
        }
    }
}

//general character class takes no inputs and should not be used as a character should just be used as a foundation for others
class Character {
    constructor(x, y, cheight, facing, health) {
        this.x = x * width;
        this.y = y * height; //represents bottom of charactor pixel position
        this.x_vel = 0;
        this.y_vel = 0;
        this.height = cheight * height;
        this.shieldOn = false; //whether or not the shield true or false
        this.shieldCool = false;
        this.onCD = false;  //whether or not the special attack is on cds
        this.specials = []; //array of active special attacks on the screen
        this.facing = facing; // 1 == facing right -1 == facing left
        this.health = health;
        this.chealth = health;
        this.shieldr = 100;
    }

    move() {
        this.x += this.x_vel;
        this.y += this.y_vel;
    }

    onGround() {
        if(activeStage.startsWith("stage")) {
            for(let plat of stages[activeStage].platforms) {
                if((this.x >= plat.x - plat.len / 2) && (this.x <= plat.x + plat.len / 2) && (this.y <= plat.y + plat.height / 2) && (this.y >= plat.y - plat.height / 2)) {
                    this.y = plat.y - plat.height / 2;
                    return true;
                }
            }
            return false;
        }
    }

    //happens every frame and moves character down if its feet are not touching the top of a platform
    gravity() {
        if(!this.onGround()) this.y_vel += g * windowHeight;
        else this.y_vel = 0;//y is inverted so adding to y makes it move downwords
    }

    //draw function that creates a semi-transparent pink circle originating in the middle of the character
    shield() {
        if(this.shieldCool === false) {
            this.shieldOn = true;
            fill(255, 192, 203, 127);
            noStroke();
            circle(this.x, (this.y - (this.height)*(1/2)), this.shieldr);
            }
        if(this.shieldOn === true && this.shieldr !== 0) {
            this.shieldr -= 0.25;
        }
        if(this.shieldr <= 0) {
            this.shieldr = 0;
            this.shieldOn = false;
            this.shieldCool = true;
            setTimeout(() => {
                this.shieldr = 100;
                this.shieldCool = false;
                console.log("Shield cooled");
            }, 2000);
        }
    }
}

//a usable character in the game
class Fighter1 extends Character {
    constructor(x, y, cheight, facing) {
        super(x, y, cheight, facing, 100);
    }

    draw() {
        rectMode(CENTER);
        fill(242, 205, 130);
        circle(this.x, this.y - 8 / 9 * this.height, 1 / 9 * this.height);//head
        fill(85, 111, 204);
        rect(this.x, this.y - 2 / 3 * this.height, 2 / 9 * this.height, 4 / 9 * this.height);//torso
        fill(186, 56, 20);
        rect(this.x, this.y - 2 / 9 * this.height, 2 / 9 * this.height, 4 / 9 * this.height);//legs
    }

    punch() {

    }

    blast() {
        if(this.onCD === false) {
            this.onCD = true;
            this.specials.push(new Hadouken(this));
            setTimeout(() => this.onCD = false, 500);
        }
    }
}

//a usable character in the game
class Fighter2 extends Character {
    constructor(x, y, cheight, facing) {
        super(x, y, cheight, facing, 100);
    }

    draw() {
        rectMode(CENTER);
        fill(124, 86, 8);
        circle(this.x, this.y - 8 / 9 * this.height, 1 / 9 * this.height);//head
        fill(255, 189, 10);
        rect(this.x, this.y - 2 / 3 * this.height, 2 / 9 * this.height, 4 / 9 * this.height);//torso
        fill(188, 4, 216);
        rect(this.x, this.y - 2 / 9 * this.height, 2 / 9 * this.height, 4 / 9 * this.height);//legs
    }
}

class SpecialMoves {
    constructor(player) {
        this.player = player;
        this.x = player.x;
        this.y = player.y;
        this.x_vel;
    }
}

class Hadouken extends SpecialMoves {
    constructor(player) {
        super(player);
        this.x_vel = 10 * player.facing;
    }
    draw() {
        imageMode(CENTER);
        rectMode(CENTER);
        this.x += this.x_vel;
        fill("blue");
        circle(this.x, this.y - this.player.height / 2, this.player.height / 6);
    }
    hits() {
        let hit = false;
        players.forEach((player) => {
            if(player != this.player) {
                if (player.shieldOn) {
                    if (dist(this.x, this.y, player.x, (player.y - (player.height*0.5))) <= ((player.height/6) + player.shieldr)) {
                        player.shieldr -=20
                        hit = true;
                    }
                }
                else if((this.x + this.player.height / 6 >= player.x - 2 / 9 * player.height) && (this.x - this.player.height / 6 <= player.x + 2 / 9 * player.height) && (this.y - this.player.height / 6 <= player.y) && (this.y + 2 / 9 * this.player.height >= player.y - player.height)) {
                    player.chealth -= 20;
                    hit = true;
                }
            }
        });
        return hit;
    }
}