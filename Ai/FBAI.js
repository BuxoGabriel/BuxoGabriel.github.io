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

function sigmoid(x) {
    return 1/(Math.exp(-x) + 1)
}

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
    // tadpoles.forEach((tadpole) =>{  second method implement eventually !!2 PARENTS!!
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

//contains matrix math that will be needed in order for the Neural Network to work
class Matrix {
    constructor(rows, cols) {
        this.rows = rows
        this.cols = cols
        this.data = []
        for(let i = 0; i < rows; i++) {
            this.data.push([]);
        }
    }

    randomize() {
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                this.data[i][j] = random(-1, 1)
            }
        }
    }

    map(fn) {
        for(let i = 0; i < this.rows; i++) {
            this.data[i] = this.data[i].map(fn)
        }
    }

    //Allows for scaler and element-wise matrix addition
    static add(a, b) {
        //Checking if a is given as a matrix if it is error is sent and function stops
        if(!(a instanceof Matrix)) {
            return console.error("The first parameter of Matrix.add must be a Matrix")
        }
        //creates new matrix for output
        let c = new Matrix(a.rows, a.cols)

        //if b is a number it justs adds b to all values of a and returns that
        if(typeof(b) == "number") {
            for(let i = 0; i < a.rows; i++) {
                for(let j = 0; j < a.cols; j++) {
                    c.data[i][j] = a.data[i][j] + b
                }
            }
        }

        //if b is a matrix all values are added element-wise which is stored and returned in c
        else if(b instanceof Matrix) {
            //returns error if the rows and cols don't exactly match up in dimensions
            if(a.rows !== b.rows || a.cols !== b.cols)
            {
                return console.error("rows and cols of both matricies must be the same")
            }

            //addition
            for(let i = 0; i < a.rows; i++) {
                for(let j = 0; j < a.cols; j++) {
                    c.data[i][j] = a.data[i][j] + b.data[i][j]
                }
            }
        }
        else {
            return console.error("The second parameter of Matrix.add must be a number or a Matrix")
        }
        return c
    }

    //Allows for Matric product and scaler multiplication
    static multiply(a, b) {
        if(!(a instanceof Matrix)) {
            return console.error("The first parameter of Matrix.multiply must be a Matrix")
        }

        // Scaler Multiplication on a Matrix
        if(typeof(b) == "number") {
            let c = new Matrix(a.rows, a.cols)
            for(let i = 0; i < a.rows; i++) {
                for(let j = 0; j < a.cols; j++) {
                    c.data[i][j] = a.data[i][j] * b
                }
            }
            return c
        }

        // Matrix Multiplication time
        /*REMEMBER THAT IF YOU ARE DOING MATRIX MULTIPLICATION ON A VERTICAL SET IT SHOULD BE SECOND FOR EXAMPLE:       Weights         Intputs     Outputs
                                                                                                                                         5.
                                                                                                               1.     [[1, 4, 3],       [[1],      [[1_5],
                                                                                                               2.      [-2, 3, 1],  *    [2],  ==   [2_5],
                                                                                                               3.      [4, 2, 1],        [3]]       [3_5],
                                                                                                               4.      [5], [-2], [8]]              [4_5]]
            Each product is the addition of all the coresponding parts added together for example 1_5's value is 1*1 + 4*2 + 3*3
        */
        else if(b instanceof Matrix) {
            //returning an error if the cols of a dont match the rows of b
            if(a.cols !== b.rows) {
                return console.error("cols of a must match rows of b")
            }

            let c = new Matrix(a.rows, b.cols)
            for(let i = 0; i < a.rows; i++) {
                for(let j = 0; j < b.cols; j++) {
                    c.data[i][j] = 0;
                    for(let k = 0; k < a.cols; k++) {
                        c.data[i][j] += a.data[i][k] * b.data[k][j]
                    }
                }
            }
            return c
        }
        else {
            return console.error("The second parameter of Matrix.multiply must be a number or a Matrix")
        }
    }

    //for turning an array into a vertical vector
    static VertfromArray(arr) {
        let a = new Matrix(arr.length, 1)
        for(let i = 0; i < a.rows; i++) {
            a.data[i][0] = arr[i]
        }
        return a
    }

    //for turning a vertical vector into an array
    static VerttoArray(mat) {
        let a = []
        if(mat.cols != 1) {
            return console.error("You can only use VerttoArray on matricies with only one column")
        }
        for(let i = 0; i < mat.rows; i++) {
            a.push(mat.data[i][0])
        }
        return a
    }
}

// The brains of the tadpole keeping it seperate from tadpole code because it is very complex and in my mind seperate from the rest of the code
class NeuralNetwork {
    constructor(inputs, outputs, hiddens) {//should be able to handle any number of hidden layers||||HIDDENS IS AN ARRAY WHERE EACH VALUE IS THE NUMBER OF NODES THAT HIDDEN LAYER SHOULD HAVE
        //creates variables to keep track of how many there are of everything
        this.inputCount = inputs       
        this.outputCount = outputs
        this.hiddens = hiddens  //an array saying how many perceptrons are in each hidden layer alsso used to determin how many hidden layers there are
        this.weights = []     
        this.biases = []
        this.hls = []
        this.inputs
        this.outputs            
        //console.log(`Initializing new Tadpole with a brain with ${this.inputCount} inputs, ${this.hiddens.length} hidden layers, and ${this.outputCount} outputs`)

        for(let i = 0; i < this.hiddens.length; i++) {
            this.biases.push(new Matrix(this.hiddens[i], 1))
            if(i == 0) {
                this.weights.push(new Matrix(this.hiddens[0], this.inputCount))
            }
            else {
                this.weights.push(new Matrix(this.hiddens[i], this.hiddens[i - 1]))
            }
        }
        this.weights.push(new Matrix(this.outputCount, this.hiddens[hiddens.length - 1]))
        this.biases.push(new Matrix(this.outputCount, 1))
        this.weights.forEach((Mat) => {
            Mat.randomize()
        })
        this.biases.forEach((Bias) => {
            Bias.randomize()
        })

    }
    //confidence on whether or not the tadpole should jump every frame
    guess(inputs) {
        if (inputs.length !== this.inputCount) {
            return console.error("you must input only as many inputs as there are input nodes")
        }
        this.inputs = Matrix.VertfromArray(inputs)
        this.hls[0] = Matrix.add(Matrix.multiply(this.weights[0], this.inputs), this.biases[0])
        this.hls[0].map(sigmoid)
        for(let i = 1; i < this.hiddens.length; i++) {
            this.hls[i] = Matrix.add(Matrix.multiply(this.weights[i], this.hls[i - 1]), this.biases[i])
            this.hls[i].map(sigmoid)
        }
        this.outputs = Matrix.add(Matrix.multiply(this.weights[this.biases.length - 1], this.hls[this.hiddens.length - 1]), this.biases[this.biases.length - 1])
        this.outputs.map(sigmoid)
        return Matrix.VerttoArray(this.outputs)
    }

    clone() {
        let a = new NeuralNetwork(this.inputCount, this.outputCount, this.hiddens)
        this.weights.forEach((weight,index) => {
            a.weights[index].data = JSON.parse(JSON.stringify(weight.data))
        })
        this.biases.forEach((bias,index) => {
            a.biases[index].data = JSON.parse(JSON.stringify(bias.data))
        })
        return a;
    }

    mutate(chance) {
        this.weights.forEach((weight, index) => {
            this.weights[index].map((x) => {
                if (random(1) <= chance) {
                    return random(-1, 1)
                }
                else return x;
            })
        })
        this.biases.forEach((bias, index) => {
            this.biases[index].map((x) => {
                if (random() <= chance) {
                    return random(-1, 1)
                }
                else return x;
            })
        })
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
        this.tadpolebrain = new NeuralNetwork(4, 1, [4])
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
    createCanvas(dispSize, dispSize)
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

                if(tadpole.tadpolebrain.guess([tadpole.y / dispSize, tadpole.y_vel / 16, tadpole.dtno / dispSize, tadpole.hono / (dispSize * 3 / 4)]) > 0.5) {
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