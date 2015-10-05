  (function () {
    window.SG = window.SG || {};

    var Coord = SG.Coord = function (x, y) {
      this.x = x;
      this.y = y;
    };

    Coord.prototype.equals = function (coord) {
      return this.x === coord.x && this.y === coord.y;
    };

    Coord.prototype.plus = function (coord) {
      // this.x += coord.x;
      // this.y += coord.y;
      return new Coord(this.x + coord.x, this.y + coord.y);
    };

    Coord.prototype.isOpposite = function (coord) {
      return this.x === -coord.x && this.y === -coord.y;
    };

    var Snake = SG.Snake = function (board) {
      // this.dir = 'N';
      this.dir = 'default';
      this.board = board;
      var center = new Coord(Math.floor(board.size / 2), Math.floor(board.size / 2));
      // debugger;
      this.segments = [center];
      this.lost = false;
      this.numOfApplesEaten = 0;
    };

    Snake.prototype.head = function () {
      return this.segments[this.segments.length - 1];
    }

    Snake.prototype.move = function () {
      // check if current position is valid

      this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));

      this.turning = false;

      // handle the situation for an apple
      if (this.eatApple()) {
        this.board.apple.replace();
      }

      if (this.growings > 0) {
        this.growings--;
      } else {
        this.segments.shift();
      }
      
      if (!this.board.isValidPosition(this.head())){
        // this.lost = true;
        this.segments = [];
        return;
      }

      for (var i = 0; i < this.segments.length - 1; i++) {
        if (this.head().equals(this.segments[i])) {
          // debugger
          this.segments = [];
          return;
        }
      }
    };

    Snake.prototype.eatApple = function () {
      if (this.head().equals(this.board.apple.position)) {
        this.numOfApplesEaten++;
        this.growings = 3;
        this.board.apple.isJustEaten = true;
        return true;
      } else {
        return false;
      }
    };

    Snake.prototype.turn = function (dir) {
      // console.log("turned...");
      // console.log(dir);
      if (Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[dir]) || this.turning) return;
      else {
        this.turning = true;
        this.dir = dir;
      }
    };

    Snake.DIFFS = {
      'N': new Coord(0, -1),
      'E': new Coord(1, 0),
      'S': new Coord(0, 1),
      'W': new Coord(-1, 0),
      'default': new Coord(0, 0)
    };

    Snake.prototype.isOccupying = function(coord) {
      this.segments.forEach(function (segment) {
        if (segment.equals(coord)) return true;
      });

      return false;
    };

    var Board = SG.Board = function (size) {
      // console.log(size);
      this.size = size;
      this.snake = new Snake(this);
      this.apple = new Apple(this);
      // console.log(this.size);
    };

    Board.prototype.render = function () {
      var grid = [];
      for (var i = 0; i < this.size; i++) {
        var row = [];
        for (var j = 0; i < this.size; i++) {
          row.push('.');
        }
        grid.push(row);
      }

      this.snake.segments.forEach(function (coord) {
        grid[coord.x][coord.y] = 'S';
      });

      grid.map(function (row) {
        return row.join(' ');
      }).join("\n");
    };

    Board.prototype.isValidPosition = function (coord) {
      return (coord.x >= 0 && coord.x < this.size
        && coord.y >=0 && coord.y < this.size);
    };

    var Apple = SG.Apple = function (board) {
      this.board = board;
      this.replace();
    };

    Apple.prototype.replace = function () {
      this.lastPosition = this.position;
      // debugger
      var x = Math.floor(Math.random() * this.board.size);
      var y = Math.floor(Math.random() * this.board.size);
      var coord = new Coord(x, y);

      while (this.board.snake.isOccupying(coord)) {
        x = Math.floor(Math.random() * this.board.size);
        y = Math.floor(Math.random() * this.board.size);
        coord = new Coord(x, y);
      }
      this.position = coord;
    };

    // Board.prototype.move = function () {};


  })();
