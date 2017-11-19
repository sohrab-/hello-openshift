window.onload = function () {
  var width = 400,
  height = 200;

  // setup canvas
  var canvas = document.createElement ("canvas");
  canvas.width = width;
  canvas.height = height;

  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // register with websocket server
  var HOST = location.origin.replace(/^http/, 'ws')
  var ws = new WebSocket(HOST);
  var alive = false;
  ws.onmessage = function (event) {
    alive = event.data == 'alive';
  };

  var x = 0;
  var y = height / 2;

  function renderBackground(a) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(20, 20, 20, ' + a + ')';
    ctx.fillRect(0, 0, width, height);
    ctx.closePath();
  }

  function render() {
    ctx.restore();
    renderBackground(0.06);

    ctx.beginPath();
    ctx.moveTo(x++, y);

    // graph
    if (alive && x >= width * .4 && x < width * .45) {
      y = y - height * 0.02;
    } else if (alive && x >= width * .45 && x < width * .55) {
      y = y + height * 0.02;
    } else if (alive && x >= width * .55 && x < width * .6) {
      y = y - height * 0.02;
    } else if (alive && x >= width * .6 && x <= width) {
      y = height / 2;
    } else if (x > width) {
      x = 0;
      ctx.moveTo(x, y);
    }

    ctx.lineTo(x, y);
    ctx.lineWidth = 5;

    if (alive) {
      ctx.strokeStyle = '#33ff33';    // green
    } else {
      ctx.strokeStyle = '#ff3333';    // red
    }

    ctx.stroke();
    ctx.closePath();
  }

  // animate
  renderBackground(1);
  setInterval(render, 5);
}