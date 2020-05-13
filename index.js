window.onload = function () {
  var myCanvas = document.getElementById("drawable");
  var canvas2 = document.getElementById("canvas2");
  var curColor = "#fff";

  const generate = () => {
    let obj = tf.browser.fromPixels(
      ctx.getImageData(0, 0, myCanvas.width, myCanvas.height),
      1
    );
    obj = tf.image.resizeBilinear(obj, [28, 28]);

    obj = tf.div(obj, 255);
    tf.browser.toPixels(obj, canvas2);

    obj = obj.expandDims(0);
    //obj.print();
    tf.loadLayersModel("https://numdetectserv.herokuapp.com/model.json").then(
      (model) => {
        document.getElementById("p1").innerHTML = model
          .predict(obj)
          .argMax(1)
          .toString();
      }
    );
  };

  if (myCanvas) {
    var isDown = false;
    var ctx = myCanvas.getContext("2d");
    var canvasX, canvasY;
    ctx.lineWidth = 15;
    ctx.fillStyle = "#000";
    ctx.lineCap = "round";

    ctx.filter = "blur(4px)";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    $(myCanvas).css("cursor", "pointer");
    $(myCanvas)
      .mousedown(function (e) {
        isDown = true;
        ctx.beginPath();
        canvasX = e.pageX - myCanvas.offsetLeft;
        canvasY = e.pageY - myCanvas.offsetTop;
        ctx.moveTo(canvasX, canvasY);
      })
      .mousemove(function (e) {
        if (isDown != false) {
          canvasX = e.pageX - myCanvas.offsetLeft;
          canvasY = e.pageY - myCanvas.offsetTop;
          ctx.lineTo(canvasX, canvasY);
          ctx.strokeStyle = curColor;
          ctx.stroke();
        }

        if (isDown) {
          //generate();
        }
      })
      .mouseup(function (e) {
        isDown = false;
        ctx.closePath();
      });

    $("#clear").mousedown(() => {
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    });

    $("#generate").mousedown(() => {
      generate();
    });
  }
};
