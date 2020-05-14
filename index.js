window.onload = function () {
  var canvas = document.getElementById("drawable");
  var canvas2 = document.getElementById("canvas2");

  const generate = () => {
    let obj = tf.browser.fromPixels(
      ctx.getImageData(0, 0, canvas.width, canvas.height),
      1
    );
    obj = tf.image.resizeBilinear(obj, [28, 28]);

    obj = tf.div(obj, 255);
    tf.browser.toPixels(obj, canvas2);

    obj = obj.expandDims(0);
    //obj.print();
    tf.loadLayersModel("https://numdetectserv.herokuapp.com/model.json").then(
      (model) => {
        let m = model.predict(obj);

        m.argMax(1)
          .data()
          .then(
            (data) => (this.document.getElementById("p1").innerHTML = data[0])
          );

        m.max()
          .data()
          .then((data) => {
            this.document.getElementById("p2").innerHTML =
              (Math.round(data[0] * 10000) / 100).toString() + "%";
          });
      }
    );
  };

  if (canvas) {
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.filter = "blur(4px)";
    var drawing = false;
    var mousePos = { x: 0, y: 0 };
    var lastPos = mousePos;
    canvas.addEventListener(
      "mousedown",
      function (e) {
        drawing = true;
        lastPos = getMousePos(canvas, e);
      },
      false
    );
    canvas.addEventListener(
      "mouseup",
      function (e) {
        drawing = false;
        generate();
      },
      false
    );
    canvas.addEventListener(
      "mousemove",
      function (e) {
        mousePos = getMousePos(canvas, e);
      },
      false
    );

    // Set up touch events for mobile, etc
    canvas.addEventListener(
      "touchstart",
      function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        canvas.dispatchEvent(mouseEvent);
      },
      false
    );
    canvas.addEventListener(
      "touchend",
      function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
      },
      false
    );
    canvas.addEventListener(
      "touchmove",
      function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        canvas.dispatchEvent(mouseEvent);
      },
      false
    );

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top,
      };
    }

    // Prevent scrolling when touching the canvas
    document.body.addEventListener(
      "touchstart",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    document.body.addEventListener(
      "touchend",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    document.body.addEventListener(
      "touchmove",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    window.requestAnimFrame = (function (callback) {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimaitonFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();
    // Draw to the canvas
    function renderCanvas() {
      if (drawing) {
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        lastPos = mousePos;
      }
    }

    // Allow for animation
    (function drawLoop() {
      requestAnimFrame(drawLoop);
      renderCanvas();
    })();

    // Get the position of the mouse relative to the canvas
    function getMousePos(canvasDom, mouseEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top,
      };
    }

    $("#clear").mousedown(() => {
      canvas.width = canvas.width;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 15;
      ctx.lineCap = "round";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(4px)";
      this.document.getElementById("p1").innerHTML = "0";
      this.document.getElementById("p2").innerHTML = "0%";
    });

    // $("#generate").mousedown(() => {
    //   generate();
    // });
  }
};
