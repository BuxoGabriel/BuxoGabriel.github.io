const resolution = 40
let img
let processedImg
let proc
let drawing = []
for(let i = 0; i < resolution; i++) {
    let temp = []
    for(let j = 0; j < resolution; j++) {
        temp.push(255)
    }
    drawing.push(temp)
}
drawing = Matrix.fromArray(drawing)

let exampleKernal = Matrix.fromArray(
    [[0, 0, 0],
     [1, 1, 1],
     [-1, -1, -1]])
let edgeProcess

function preload() {
    img = loadImage("theSquad.jpg")
}

function setup() {
    createCanvas(800, 800)
    img.loadPixels()
    processedImg = createImage(img.width - 2, img.height - 2)
    updateImage()
    image(img, 0, height / 2 + 3)

    document.querySelector("#clear").onclick = () => {
        for(let y = 0; y < resolution; y++) {
            for(let x = 0; x < resolution; x++) {
                drawing.data[x][y] = 255
            }
        }
    }
    document.querySelector("#form").onclick = () => {
        updateImage()
        return false;
    }
}

function draw() {
    for(let y = 0; y < resolution; y++) {
        for(let x = 0; x < resolution; x++) {
            fill(drawing.data[y][x])
            rect(width / resolution * x / 2, height / resolution * y / 2, width / resolution / 2, height / resolution / 2)
        }
    }
    if( mouseIsPressed && 
        mouseX < width / 2 && 
        mouseX > 0 &&
        mouseY < height / 2 &&
        mouseY > 0)
        drawing.data[Math.floor(mouseY / width * resolution * 2)][Math.floor(mouseX / width * resolution * 2)] = 0
    
    edgeProcess = applyConvolution(drawing, exampleKernal)
    for(let y = 0; y < edgeProcess.rows; y++) {
        for(let x = 0; x < edgeProcess.cols; x++) {
            fill(edgeProcess.data[y][x])
            rect(width / resolution * x / 2 + width / 2, height / resolution * y / 2, width / resolution , height / resolution / 2)
        }
    }
}

function applyConvolution(source, kernal) {
    let convolution = new Matrix(source.rows - kernal.rows + 1, source.cols - kernal.cols + 1)
    let padding =  Math.floor(kernal.rows / 2)
    for(let i = padding; i < convolution.rows + padding; i++) {
        for(let j = padding; j < convolution.cols + padding; j++) {
            convolution.data[i - padding][j - padding] = Matrix.sum(   
                Matrix.Multiply(kernal, 
                    Matrix.subMatrix(source, i - padding, i + padding, j - padding, j + padding), 
                {Piecewise: true}))
        }
    }
    return convolution
}

function updateImage() {
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            exampleKernal.data[i][j] = Number(document.querySelector("#k" + String(i * 3 + j)).value)
        }
    }
    proc = [[], [], []]
    for(let i = 0; i < img.pixels.length; i+=4) {
        proc[0].push(img.pixels[i + 0])
        proc[1].push(img.pixels[i + 1])
        proc[2].push(img.pixels[i + 2])
    }
    proc[0] = Matrix.shapefromArray(proc[0], img.width, img.height)
    proc[1] = Matrix.shapefromArray(proc[1], img.width, img.height)
    proc[2] = Matrix.shapefromArray(proc[2], img.width, img.height)
    proc[0] = applyConvolution(proc[0], exampleKernal)
    proc[1] = applyConvolution(proc[1], exampleKernal)
    proc[2] = applyConvolution(proc[2], exampleKernal)
    for(let y = 0; y < img.width - 2; y++) {
        for(let x = 0; x < img.height - 2; x++) {
            processedImg.set(x, y, color(proc[0].data[y][x], proc[1].data[y][x], proc[2].data[y][x]))
        }
    }
    processedImg.updatePixels()
    processedImg.loadPixels()
    image(processedImg, width / 2, height / 2)
}