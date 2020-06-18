static toArray(mat) {
    let a = []
    for(let i = 0; i < mat.rows; i++) {
        a.push(mat.data[i])
    }
    return a
}

static fromArray(arr) {
    let a = new Matrix(arr.length, arr[0].length)
    for(let i = 0; i < a.rows; i++) {
        for(let j = 0; j < a.cols; j++) {
            a.data[i][j] = arr[i][j]
        }
    }
    return a
}

reshape(rows, cols) {
    if(!(this.rows * this.cols == rows * cols)) return console.error("Must reshape such that it holds the same amount of data")
    let a = Matrix.toArray(this)
    this.data = []
    for(let i = 0; i < rows; i++) {
        this.data.push([])
        for(let j = 0; j < cols; j++) {
            this.data[i][j] = a[i * cols + j]
        }
    }
    while(this.data.length > rows) {
        this.data.pop()
    }
    this.rows = rows, this. cols = cols
}

static toArray(mat) {
    let a = []
    for(let i = 0; i < mat.rows; i++) {
        for(let j = 0; j < mat.cols; j++) {
            a.push(mat.data[i][j])
        }
    }
    return a
}