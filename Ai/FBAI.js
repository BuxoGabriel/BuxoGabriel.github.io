'use strict'
const dispSize = 600                //leave 600 or it breaks or looks weird
const HpipeWidth = dispSize / 30    //also leave as is or breaks -- half of the pipe width
const pipeGap = dispSize / 5
const gravity = 0.1
const maxVelocity = 16;
const pipeSpeed = 2
const tadpolesize = 20
let tadpolecount = 500
let tadpoles = []
let pipes = []
let generations = 1
let dead = 0
let mutation_rate = 0.1
let avgfit = 0;
let watchSpeed = 1
let score = 0
let highscore = 0

let backgroundx = 0
let backgroundImage
let seaweed
let tadpoleImage

function nextGen() {                                    //sort tadpoles by fitness, replace last half with copies of the first half, mutate all
    tadpoles.forEach((tadpole) =>{                    //CURRENT VERSION IS 1 PARENT SPLIT MUTATION. MUTATION CHANCE IS INVERSLY PREPORTIONAL WITH HOW FIT THE TADPOLE IS RELATIVE TO ITS GENERATION
        avgfit += tadpole.fitness
    })
    avgfit /= tadpoles.length
    tadpoles.splice(0, tadpolecount / 2)
    for(let i = 0; i < tadpolecount / 2; i++) {
        tadpoles.push(new Tadpole())
        tadpoles[tadpolecount / 2 + i].tadpolebrain = tadpoles[i].tadpolebrain.clone()
        tadpoles[tadpolecount / 2 + i].fitness = tadpoles[i].fitness
        tadpoles[tadpolecount / 2 + i].color = tadpoles[i].color
        tadpoles[i].tadpolebrain.mutate(mutation_rate / (tadpoles[i].fitness / avgfit))
        tadpoles[tadpolecount / 2 + i].tadpolebrain.mutate(mutation_rate / (tadpoles[tadpolecount / 2 + i].fitness / avgfit))
        tadpoles[i].y = height / 2
        tadpoles[tadpolecount / 2 + i].y = height / 2
        tadpoles[i].dead = false
        tadpoles[i].tadpolebrain.fitness = 0
        tadpoles[tadpolecount / 2 + i].fitness = 0
    }
    // tadpoles.forEach((tadpole) =>{  //second method implement eventually !!2 PARENTS!!
    //     avgfit += tadpole.fitness
    // })
    // let a = []
    // for (let i = 0; i < tadpolecount; i++) {
    //     a.push(new Tadpole())
    //     a[i].tadpolebrain.weights.forEach((Mat) => {
    //         tadpoles.forEach((tadpole) => {

    //         })
    //     })
    // }
    pipes[0].x = dispSize / 2
    if(pipes.length == 1) pipes.push(new rngPipe(dispSize))
    else pipes[1].x = dispSize
    generations++
    dead = 0;
    avgfit = 0;
    score = 0
}

//random height pipe obstacles class
class rngPipe {
    constructor(x) {
        this.x = x
        this.height = random(height / 4, height * 3 / 4 - pipeGap)
        //console.log("constructed new rng pipe at position " + this.x + " with height of " + this.height)
    }

    show() {
        fill("green")
        image(seaweed, this.x - HpipeWidth, this.height - dispSize * 3 / 4)
        push()
        translate(this.x + 2 * HpipeWidth, this.height + height * 3 / 4 + pipeGap)
        rotate(PI)
        image(seaweed, 0, 0)
        pop()
    }
}
// tadpole Class. There will be hundreds of tadpoles so it is easiest to make a class for them
class Tadpole {
    constructor() {
        this.x = dispSize / 10
        this.y = height / 2
        this.y_vel = 0
        this.dtno                                              //distance to next obstacle
        this.hono                                           //hight of next obstacle
        this.tadpolebrain = new NeuralNetwork([4, 4, 1])
        this.color = [random(255), random(255), random(255)]
        this.dead = false
        this.fitness = 0;
    }

    show() {
        fill(this.color)
        circle(this.x, this.y, tadpolesize)
    }

    move() {
        this.y += this.y_vel
    }
    //collision detection
    touching(pipe) {
        if(this.y + tadpolesize >= height ||
        this.y - tadpolesize <= 0 ||
        (this.x >= pipe.x - HpipeWidth && this.x <= pipe.x + HpipeWidth) && (this.y - tadpolesize <= pipe.height || this.y + tadpolesize >= pipe.height + pipeGap)) {
            return true
        }
    }
    jump() {
        this.y_vel -= 6
    }
}

//loads images for background, tadpoles, and seaweed
function preload() {
    tadpoleImage = loadImage('tadpole.jpg')
    backgroundImage = loadImage('background.jpg')
    seaweed = loadImage("seaweed.png")
}

function setup() {
    let canvas = createCanvas(dispSize, dispSize)
    canvas.parent('graphics')
    for(let i = 0; i < tadpolecount; i++) {
        tadpoles.push(new Tadpole())
    }
    document.querySelector("#respawn").onclick = () => {nextGen(); return false}
    //document.querySelector("#changem").onsubmit = () => {mutation_rate = document.querySelector("#mut").value / 100; return false}
    document.querySelector("#slower").onclick = () => {if(watchSpeed != 1) watchSpeed /= 2}
    //document.querySelector("#playPause").onclick = () => {figure out later}
    document.querySelector("#faster").onclick = () => {if(watchSpeed != 256) watchSpeed *= 2}
    rectMode(CORNERS)
    pipes.push(new rngPipe(dispSize / 2))
    pipes.push(new rngPipe(dispSize))
}

function draw() {
    if(score > highscore) highscore = score
    document.querySelector("#gen").innerHTML = "Generation: " + generations
    document.querySelector("#alive").innerHTML = "Tadpoles Alive: " + (tadpolecount - dead)
    document.querySelector("#highscore").innerHTML = "Highscore: " + (highscore)
    document.querySelector("#score").innerHTML = "Score: " + (score)
    document.querySelector("#speed").innerHTML = watchSpeed + 'x'
    for(let i = 0; i < watchSpeed; i++) {
        if(dead == tadpolecount) {
            nextGen()
        }

        if(pipes.length == 1) {
            pipes.push(new rngPipe(dispSize))
            score++
        }

        pipes.forEach((pipe, index) => {
            if(pipe.x + HpipeWidth <= 0) pipes.splice(index, 1)
            else pipe.x -= pipeSpeed
        })

        tadpoles.forEach((tadpole, index) => {
            if(!tadpole.dead) {
                tadpole.dtno = pipes[0].x
                tadpole.hono = pipes[0].height
                tadpole.y_vel += gravity
                if(tadpole.y_vel < -maxVelocity) {
                    tadpole.y_vel = -maxVelocity
                }
                else if (tadpole.y_vel > maxVelocity) {
                    tadpole.y_vel = maxVelocity
                }

                if(tadpole.tadpolebrain.feedforward([tadpole.y / dispSize, tadpole.y_vel / 16, tadpole.dtno / dispSize, tadpole.hono / (dispSize * 3 / 4)]) > 0.5) {
                    tadpole.jump()
                }

                tadpole.move()
                if(tadpole.touching(pipes[0])) {
                    tadpole.dead = true
                    dead++
                    let a = tadpoles.splice(index, 1)
                    tadpoles.push(a[0])
                }
                else tadpole.fitness++
            }
        })
        backgroundx--
    }
    background("grey")
    if(backgroundx <= -dispSize) backgroundx = 0
    image(backgroundImage, backgroundx, 0)
    image(backgroundImage, dispSize + backgroundx, 0)
    pipes.forEach((pipe) => {pipe.show()})
    tadpoles.forEach((tadpole) => {if(!tadpole.dead) tadpole.show()})
}