//normalization function d/dx = sigmoid(x)(1 - sigmoid(x))
function sigmoid(x) {
    return 1/(Math.exp(-x) + 1)
}
//NeuralNetwork class takes in input which is an array showing the structure for example 3 input, 1 hidden layers of 2 nodes, and 1 output you would pass in [3, 2, 1] though it can take any amount of layers
class NeuralNetwork {
    constructor(structure) {
        this.structure = structure  //array showing how many ionput nodes there are how many hidden layers and hidden nodes there are and how many outoput nodes there are
        this.layers = new Array(structure.length)
        this.weights = new Array(structure.length - 1)
        this.biases = new Array(structure.length - 1)
        this.lr = 0.1
        this.loss
        this.cost = 0
        this.trainingRounds = 0

        for(let i = 0; i < this.biases.length; i++) {
            this.biases[i] = new Matrix(this.structure[i + 1], 1)
            this.biases[i].randomize()
            this.weights[i] = new Matrix(this.structure[i + 1], this.structure[i])
            this.weights[i].randomize()
        }
    }

    setlr(lr) {
        this.lr = lr
    }

    getLoss() {
        return this.loss
    }

    getCost() {
        return this.cost / this.trainingRounds
    }
    
    feedforward(inputs) {
        if (inputs.length !== this.structure[0]) {
            return console.error("you must input only as many inputs as there are input nodes")
        }
        if(inputs instanceof Array|| inputs instanceof Uint8Array) inputs = Matrix.VertfromArray(inputs)
        else if (!(inputs instanceof Matrix)) return console.error("inputs must be of type array or Matrix")
        this.layers[0] = inputs
        for(let i = 0; i < this.weights.length; i++) {
            this.layers[i + 1] = Matrix.Multiply(this.weights[i], this.layers[i], {Matrix: true});
            this.layers[i + 1].map(sigmoid)
        }
        this.trainingRounds++
        return Matrix.VerttoArray(this.layers[this.layers.length - 1])
    }

    clone() {
        let a = new NeuralNetwork(this.structure)
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

    train(inputs, expected) {
        if(expected instanceof Array) expected = Matrix.VertfromArray(expected)
        else if(!(expected instanceof Matrix)) return console.error("outputs must be of type array or matrix")
        let outputs = this.feedforward(inputs)
        this.loss = 0
        this.errors = new Array(this.structure.length)
        for(let i = this.structure.length - 1; i >= 0; i--) {
            if(i == this.structure.length - 1) {
                this.errors[i] = Matrix.Subtract(expected, this.layers[i])                                                                                                  
                for(let j = 0; j < this.errors[i].rows; j++) {
                    this.loss += Matrix.Map(this.errors[i], (x) => {return x * x / 2}).data[j][0]
                }
                this.loss /= this.errors[i].rows
                this.cost += this.loss
                this.errors[i] = Matrix.Multiply(this.errors[i], Matrix.Map(this.layers[i], (x) => {return x * (1 - x)}), {Piecewise: true})
            }
            else {
                this.errors[i] = Matrix.Multiply(this.weights[i].transpose(), this.errors[i + 1], {Matrix: true})
                this.errors[i].map((x)=>{return x / this.errors[i + 1].rows})
                this.errors[i] = Matrix.Multiply(this.errors[i], Matrix.Map(this.layers[i], (x)=>{return x * (1 - x)}), {Piecewise: true})
            }
            if(i != 0) {
                this.biases[i - 1] = Matrix.Add(this.biases[i - 1], Matrix.Multiply(this.errors[i], this.lr))
                this.weights[i - 1] = Matrix.Add(this.weights[i - 1], Matrix.Multiply(Matrix.Multiply(this.errors[i], this.layers[i - 1].transpose(), {Matrix: true}), this.lr))
            }
        }
        return outputs.indexOf(Math.max(...outputs))
    }
    
    getBrain() {
        let weights = new Array(this.weights.length)
        for(let i = 0; i < weights.length; i++) {
            weights[i] = this.weights[i].data
        }

        let biases = new Array(this.biases.length)
        for(let i = 0; i < biases.length; i++) {
            biases[i] = this.biases[i].data
        }
        return[weights, biases]
    }

    setBrain(arr) {
        this.weights.forEach((weight, index) => weight.data = arr[0][index])
        this.biases.forEach((bias, index) => bias.data = arr[1][index])
    }
}