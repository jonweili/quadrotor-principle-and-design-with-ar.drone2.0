$(document).ready(function(){
  socket = io.connect('http://192.168.199.174:8000');
  $('.take-off').click(function() {
    socket.emit('take-off');
    $('.take-off').addClass('disabled');
    $('.land').removeClass('disabled');
  });

  $('.up').mousedown(function() {
    console.log(1);
  })
  $('.up').mouseup(function() {
    console.log(2);
  })

  $('.land').click(function() {
    socket.emit('land');
    $('.take-off').removeClass('disabled');
    $('.land').addClass('disabled');
  });
  $('.stop').click(function() {
    socket.emit('stop'); 
  });

  $('.up').click(function() {
    socket.emit('up', { speed: 0.1 });
  });
  $('.down').click(function() {
    socket.emit('down', { speed: 0.1 });
  });

  $('.clockwise').click(function() {
    socket.emit('clockwise', { speed: 0.1 });
  });
  $('.counter-clockwise').click(function() {
    socket.emit('counter-clockwise', { speed: 0.1 });
  });

  $('.front').click(function() {
    socket.emit('front', { speed: 0.1 });
  });
  $('.back').click(function() {
    socket.emit('back', { speed: 0.1 });
  });
  $('.left').click(function() {
    socket.emit('left', { speed: 0.1 });
  });
  $('.right').click(function() {
    socket.emit('right', { speed: 0.1 });
  });

  isFullScreen = false;
  $('.full-screen').click(function() {
    if (isFullScreen == false) {
      setFullScreen($('html')[0]);
      $(this).text('退出全屏');
      isFullScreen = true;
    } else {
      exitFullScreen();
      $(this).text('全屏');
      isFullScreen = false;
    }
  })

  setAutoMoveController();
});

function setAutoMoveController() {
  $('.primary-control-center').mousedown(function(event) {
    show(event);
  })
  $('.primary-control').mouseout(function() {
    hide();
  })
}

var mouseX;
var mouseY;

function show(event) {
  mouseOver(event);
  var infoDiv = document.getElementById('infoDiv');
  infoDiv.style.display = "block";
  infoDiv.innerHTML = mouseX + " " + mouseY;
  infoDiv.style.left = mouseX + 10 + "px";
  infoDiv.style.top = mouseY + 10 + "px";    
}

function hide() {
  var infoDiv = document.getElementById('infoDiv').style.display = "none";
}

function mouseOver(obj) {
  e = obj || window.event;
  // 此处记录鼠标停留在组建上的时候的位置, 可以自己通过加减常量来控制离鼠标的距离.
  mouseX =  e.layerX || e.offsetX;
  mouseY =  e.layerY || e.offsetY; 
}

function setFullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
