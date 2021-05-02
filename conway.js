class Grid {
  currGrid = [];
  nextGrid = [];
  cellSize = 10;
  aliveColor = '#000';
  deadColor = '#8B947A';
  color;
  neighbors = 0;
  canvas;
  ctx;

  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.rows = canvas.height / this.cellSize;
    this.columns = canvas.width / this.cellSize;
    this.color = this.deadColor;
    this.setInitialState(ctx);
    this.updateGrid(ctx)
  }

  initArray() {
    let arr = new Array(this.rows);
    for (var j = 0; j < arr.length; j++) {
      arr[j] = new Array(this.columns);
    }
    return arr;
  }


  setInitialState(ctx) {   //set initial state of grid
    this.currGrid = this.initArray();
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.columns; j++) {
        this.currGrid[i][j] = Math.random() > 0.5; //set random cell states -- true (alive), false (dead)
      }
    }
    this.draw(ctx, this.currGrid);
  }

  draw(ctx, grid) { //draw the grid on canvas
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.color = grid[i][j] ? this.aliveColor : this.deadColor;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.aliveColor;
        ctx.fillRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize); //draw the cells
        ctx.strokeRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize); //draw the border
      }
    }
  }

  clearCanvas(ctx) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        ctx.clearRect(0, 0, this.cellSize, this.cellSize);
      }
    }
  }

  getNeighbor(i, j, grid) {
    return (i < 0 || j < 0 || i >= this.rows || j >= this.columns) ? 0 : grid[i][j];  //check for edge cells
  }

  getTotalNeighbors(i, j, grid) {
    return (
      this.getNeighbor(i - 1, j, grid) +
      this.getNeighbor(i + 1, j, grid) +
      this.getNeighbor(i, j - 1, grid) +
      this.getNeighbor(i, j + 1, grid) +
      this.getNeighbor(i - 1, j - 1, grid) +
      this.getNeighbor(i + 1, j + 1, grid) +
      this.getNeighbor(i + 1, j - 1, grid) +
      this.getNeighbor(i - 1, j + 1, grid)
    );
  }

  updateGrid(ctx) {
    this.nextGrid = this.initArray();
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.neighbors = this.getTotalNeighbors(i, j, this.currGrid);
        if (this.currGrid[i][j] && (this.neighbors > 3 || this.neighbors < 2)) { //any live cell with more than 3 neighbors or less than 2 neighbors dies in the next gen
          this.nextGrid[i][j] = 0;
        }
        else if (this.neighbors == 3 && !this.currGrid[i][j]) { //any live cell with 3 live neighors lives in the next gen
          this.nextGrid[i][j] = 1;
        }
        else { //other cells retain their state                                        
          this.nextGrid[i][j] = this.currGrid[i][j];
        }
      }
    }
    this.currGrid = this.nextGrid;
    this.draw(ctx, this.currGrid);

    window.requestAnimationFrame(() => this.updateGrid(ctx)); //update animation frame
  }
}


const canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
gameGrid = new Grid(canvas, ctx);

