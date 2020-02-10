let imageSize = 28 * 28
let pen = true
let NN = new NeuralNetwork([imageSize, 64, 10])

let correct = 0
let total = 0
let epochs = 0
let brain

function preload() {
    brain = loadJSON("./brain" + document.querySelector("#brains").selectedIndex + ".json")
}

function setup() {
    NN.setBrain(brain)
    document.querySelector("#brains").onchange = () => {
        loadJSON("./brain" + document.querySelector("#brains").selectedIndex + ".json", info => NN.setBrain(info))
    }
    document.querySelector("#pen").onclick = () => {
        pen = true
    }
    document.querySelector("#eraser").onclick = () => {
        pen = false
    }
    document.querySelector("#clear").onclick = () => {
        background("black")
    }
    document.querySelector("#guess").onclick = () => {
        let drawing = []
        let img = get()
        img.resize(28, 28)
        img.loadPixels()
        for(let i = 0; i < imageSize; i++) {
            drawing[i] = img.pixels[i * 4]
        }
        image(img, 0, 0)
        let guesses = NN.feedforward(drawing)
        document.querySelector("#thisis").innerHTML = "This is a " + guesses.indexOf(Math.max(...guesses))
        for(let i = 0; i < document.querySelector("#guesses").children.length; i++) {
            document.querySelector("#guesses").children[i].style.color = 0xff2222//parseInt(guesses[i] * 255, 16);
            document.querySelector("#guesses").children[i].innerHTML = `confidence it is ${i}: ${guesses[i].toFixed(2)}%`
        }
    }
    createCanvas(300, 300)
    background("black")
}

function draw() {
    if(mouseIsPressed) {
        if(pen) {
            stroke(255)
            strokeWeight(25)
        }
        else {
            stroke(0)
            strokeWeight(35)
        }
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}