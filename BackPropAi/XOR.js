let trainingset = [[[1, 1], [0]], [[0, 1], [1]], [[1, 0], [1]], [[0, 0], [0]]]
let resolution = 40
let NN = new NeuralNetwork([2, 3, 1])
function setup() {
    createCanvas(800, 800)
}
function draw() {
    for(let i = 0; i < 10000; i++) {
        let r = Math.floor(Math.random() * 4)
        NN.train(trainingset[r][0], trainingset[r][1])
    }

    for(let i = 0; i < resolution; i++) {
        for(let j = 0; j < resolution; j++) {
            let grayscale = NN.feedforward([i / resolution, 1 - j / resolution])
            fill(grayscale[0] * 255)
            rect(width / resolution * i, height / resolution * j, width / resolution, height / resolution)
        }
    }
    document.querySelector("#loss").innerHTML = "Loss: " + NN.getLoss() * 100
    document.querySelector("#cost").innerHTML = "Cost: " + NN.getCost() * 100
}