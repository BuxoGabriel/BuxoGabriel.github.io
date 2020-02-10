
//contains matrix math that will be needed in order for the Neural Network to work
class Matrix {
    constructor(rows, cols) {
        this.rows = rows
        this.cols = cols
        this.data = []
        for(let i = 0; i < rows; i++) {
            this.data.push([]);
            for(let j = 0; j < cols; j++) {
                this.data[i][j] = 0
            }
        }
    }

    randomize() {
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random() * 2 - 1
            }
        }
    }

    map(fn) {                                           //scuffed function cant be used for callbacks that are not intended to alter original unless u add return x to the end of the callback
        for(let i = 0; i < this.rows; i++) {
            this.data[i] = this.data[i].map(fn)
        }
    }

    static Map(a, fn) {
        if (!(a instanceof Matrix)) console.error("first argument must be and array")
        let b = new Matrix(a.rows, a.cols)
        for(let i = 0; i < a.rows; i++) {
            b.data[i] = a.data[i].map(fn)
        }
        return b
    }

    //Allows for scaler and element-wise matrix addition
    Add(a) {
        //if a is a number it justs adds a to all values of this.data
        if(typeof(a) == "number") {
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.data[i][j] += a
                }
            }
        }

        //if b is a matrix all values are added element-wise which is stored and returned in c
        else if(a instanceof Matrix) {
            //returns error if the rows and cols don't exactly match up in dimensions
            if(this.rows !== a.rows || this.cols !== a.cols)
            {
                return console.error("rows and cols of both matricies must be the same")
            }

            //element-wise addition
            for(let i = 0; i < a.rows; i++) {
                for(let j = 0; j < a.cols; j++) {
                    this.data[i][j] += a.data[i][j]
                }
            }
        }
        else {
            return console.error("The second parameter of Matrix.add must be a number or a Matrix")
        }
    }

    static Add(a, b) {
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
    
    static Subtract(a, b) {
        if(typeof(a) == "number" && b instanceof Matrix) {
            let c = new Matrix(b.rows, b.cols)
            for(let i = 0; i < b.rows; i++) {
                for(let j = 0; j < b.cols; j++) {
                    c.data[i][j] = a - b.data[i][j]
                }
            }
            return c
        }

        //Checking if a is given as a matrix if it is error is sent and function stops
        if(!(a instanceof Matrix)) {
            return console.error("The first parameter of Matrix.Subtract must be a Matrix")
        }
        //creates new matrix for output
        let c = new Matrix(a.rows, a.cols)

        //if b is a number it justs subtracts b from all values of a and returns that
        if(typeof(b) == "number") {
            for(let i = 0; i < a.rows; i++) {
                for(let j = 0; j < a.cols; j++) {
                    c.data[i][j] = a.data[i][j] - b
                }
            }
        }

        //if b is a matrix all values are subtracted element-wise which is stored and returned in c
        else if(b instanceof Matrix) {
            //returns error if the rows and cols don't exactly match up in dimensions
            if(a.rows !== b.rows || a.cols !== b.cols)
            {
                return console.error("rows and cols of both matricies must be the same")
            }

            //subtraction
            for(let i = 0; i < a.rows; i++) {
                for(let j = 0; j < a.cols; j++) {
                    c.data[i][j] = a.data[i][j] - b.data[i][j]
                }
            }
        }
        else {
            return console.error("The second parameter of Matrix.add must be a number or a Matrix")
        }
        return c
    }

    //Allows for Matric product and scaler multiplication
    Multiply(a, properties) {
        // Scaler Multiplication on a Matrix
        if(typeof(a) == "number") {
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                   this.data[i][j] *= a
                }
           }
        }
    
        else if(a instanceof Matrix && properties.matrix) {
            //returning an error if the cols of a dont match the rows of b
            if(this.cols !== a.rows) {
                return console.error("cols of a must match rows of b")
            }

            let b = new Matrix(a.rows, b.cols)
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < a.cols; j++) {
                    b.data[i][j] = 0;
                    for(let k = 0; k < this.cols; k++) {
                        b.data[i][j] += this.data[i][k] * a.data[k][j]
                    }
                }
            }
            this.data = c.data
        }
        else if(a instanceof Matrix && properties.piecewise) {
            //returning an error if the cols of a dont match the rows of b
            if(this.cols !== a.cols || this.rows !== a.rows) {
                return console.error("Matricies must have same dimensions for piecewise multiplication")
            }
            for(let i = 0; i < a.rows; i++) {
                for(let j = 0; j < a.cols; j++) {
                    this.data[i][j] *= a.data[i][j]
                }
            }
        }
        else {
            return console.error("The first parameter of .Multiply must be a number or a Matrix")
        }
    }
    
    static Multiply(a, b, properties) {
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

        else if(b instanceof Matrix && properties.Matrix) {
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
        else if(b instanceof Matrix && properties.Piecewise) {
            //returning an error if the cols of a dont match the rows of b
            if(a.cols !== b.cols || a.rows !== b.rows) {
                return console.error("Matricies must have same dimensions for piecewise multiplication")
            }

            let c = new Matrix(a.rows, a.cols)
            for(let i = 0; i < a.rows; i++) {
                for(let j = 0; j < a.cols; j++) {
                    c.data[i][j] = a.data[i][j] * b.data[i][j]
                }
            }
            return c
        }
        else {
            return console.error("The second parameter of Matrix.multiply must be a number or a Matrix with the correct multiplication type identifier")
        }
    }

    transpose() {
        let a = new Matrix(this.cols, this.rows)
        for (let i = 0; i < this.cols; i++) {
            for(let j = 0; j < this.rows; j++) {
                a.data[i][j] = this.data[j][i]
            }
        }
        return a;
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
