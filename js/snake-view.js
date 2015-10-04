(function() {
  window.SG = window.SG || {};

  var View = SG.View = function ($el) {
    this.$el = $el;

    this.board = new SG.Board(20);
    this.setupGrid();
    $(window).on('keydown', this.handleKeyPress.bind(this));
    this.intervalHandle = window.setInterval(this.step.bind(this), 100);
    // this.intervalHandle = window.setTimeout(this.step.bind(this), 500);
  };

  View.KEYS = {
    38: 'N',
    39: 'E',
    40: 'S',
    37: 'W'
  };

  View.prototype.handleKeyPress = function (event) {
    if (View.KEYS[event.keyCode]) {
      if (!this.started) this.started = true;
      this.board.snake.turn(View.KEYS[event.keyCode]);
    }
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      if (this.started) this.board.snake.move();
      this.render();
    } else {
      window.clearInterval(this.intervalHandle);
      // alert('you lost');
      $('.modal').addClass('is-open');
    }

  };

  View.prototype.setupGrid = function (event) {
    var html = "";
    for (var i = 0; i < this.board.size; i++) {
      html += "<ul>";
      for (var j = 0; j < this.board.size; j++) {
        html += "<li/>";
      }
      html += "</ul>";
    }
    this.$el.html(html);
  };



  View.prototype.render = function () {
    // First remove all the classes of li's
    this.$el.find('li').removeClass();

    this.board.snake.segments.forEach (function (coord) {
      var index = coord.y * this.board.size + coord.x;
      this.$el.find('li').eq(index).addClass('snake');
    }.bind(this));

    var apple = this.board.apple;
    var index = apple.position.y * this.board.size + apple.position.x;
    this.$el.find('li').eq(index).addClass('apple');

    if (apple.isJustEaten) {
      apple.isJustEaten = false;
      index = apple.lastPosition.y * this.board.size + apple.lastPosition.x;
      this.$el.find('li').eq(index).toggle("pulsate").toggle("pulsate");
    }
  }
})();
