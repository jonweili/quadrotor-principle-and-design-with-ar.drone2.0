$(document).ready(function(){
  socket = io.connect(document.URL);

  $('.take-off').click(function() {
    socket.emit('take-off');
    $('.take-off').addClass('disabled');
    $('.land').removeClass('disabled');
  });

  $('.land').click(function() {
    socket.emit('land');
    $('.take-off').removeClass('disabled');
    $('.land').addClass('disabled');
  });
  $('.stop').click(function() {
    socket.emit('stop'); 
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
  setAutoMoveController(socket);
});

function setAutoMoveController(socket) {
  var primaryCenterLeft = (230 - 100) / 2;
  var primaryCenterTop = (230 - 100) / 2;

  var planarCenterLeft = (230 - 100) / 2;
  var planarCenterTop = (230 - 100) / 2;

  $('.primary-control-center').css('left', primaryCenterLeft).css('top', primaryCenterTop);
  $('.planar-control-center').css('left', planarCenterLeft).css('top', planarCenterTop);

  document.addEventListener('touchmove', function(evt) {
    for (var i = 0; i < evt.changedTouches.length; i++) {
      if (evt.changedTouches[i].clientX < document.body.clientWidth / 2) {
        setPrimaryTouchMove(evt, socket);
      }
      else if (evt.changedTouches[i].clientX > document.body.clientWidth / 2) {
        setPlanarTouchMove(evt, socket);
      }
    }
    evt.preventDefault();
  }, false);

  document.addEventListener('touchend', function(evt) {
    for (var i = 0; i < evt.changedTouches.length; i++) {
      if (evt.changedTouches[i].clientX < document.body.clientWidth / 2) {
        $('.primary-control-center').css('left', primaryCenterLeft).css('top', primaryCenterTop);
        socket.emit('stop'); 
      } else {
        $('.planar-control-center').css('left', planarCenterLeft).css('top', planarCenterTop);
        socket.emit('stop'); 
      }
    }
  }, false);
}

function setPlanarTouchMove(evt, socket) {
  if (evt.changedTouches[0].clientX < document.body.clientWidth / 2) {
    var centerLeft = (230 - 100) / 2;
    var centerTop = (230 - 100) / 2;
    $('.planar-control-center').css('left', centerLeft).css('top', centerTop);
    return;
  }

  var planarLeft = evt.changedTouches[0].clientX - $('.planar-control').offset().left - ($('.planar-control-center').outerWidth() / 2);
  var planarTop = evt.changedTouches[0].clientY - $('.planar-control').offset().top - ($('.planar-control-center').outerWidth() / 2);

  var dist = Math.sqrt(((planarLeft + 50) - 230 / 2) * ((planarLeft + 50) - 230 / 2)
    + (planarTop + 50 - 230 / 2) * (planarTop + 50 - 230 / 2));

  var planarX = planarLeft + 50 - 115;
  var planarY = planarTop + 50 - 115;

  if (dist > 230 / 2) {
    var destY = evt.changedTouches[0].clientX - $('.planar-control').offset().left;
    var destX = evt.changedTouches[0].clientY - $('.planar-control').offset().top;

    var k = (115 - destY) / (destX - 115);
    var h = -115 - 115 * k;

    var a = 1 + k * k;
    var b = 2 * k * (h + 115) - 230;
    var c = 115 * 115;

    var x1 = (- b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    var x2 = (- b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);

    // bug
    var temp = destX;
    destX = destY;
    destY = temp;

    var centerX = destX - 115;
    var centerY = destY - 115;
    var x = 0;
    var y = 0;

    if (centerX > 0 && centerY > 0) {
      x = getMax(x1, x2);
      y = getY(x).y1;
    }
    else if (centerX > 0 && centerY < 0) {
      x = getMax(x1, x2);
      y = getY(x).y2;
    }
    else if (centerX < 0 && centerY > 0) {
      x = getMin(x1, x2);
      y = getY(x).y1;
    } else {
      x = getMin(x1, x2);
      y = getY(x).y2;
    }

    planarLeft = x - 50;
    planarTop = y - 50;

    planarX = x - 115;
    planarY = y - 115;
  }

  $('.planar-control-center').css('left', planarLeft).css('top', planarTop);

  if (planarX > 0 && planarY > 0) {
    var right = Math.abs(planarX) / 115;
    var back = Math.abs(planarY) / 115;
    console.log(right, back);
    socket.emit('right', {speed: right});
    socket.emit('back', {speed: back});
  }
  else if (planarX > 0 && planarY < 0) {
    var right = Math.abs(planarX) / 115;
    var front = Math.abs(planarY) / 115;
    console.log(right, front);
    socket.emit('right', {speed: right});
    socket.emit('front', {speed: front});
  }
  else if (planarX < 0 && planarY > 0) {
    var left = Math.abs(planarX) / 115;
    var back = Math.abs(planarY) / 115;
    console.log(left, back);
    socket.emit('left', {speed: left});
    socket.emit('back', {speed: back});
  } else {
    var left = Math.abs(planarX) / 115;
    var front = Math.abs(planarY) / 115;
    console.log(left, front);
    socket.emit('left', {speed: left});
    socket.emit('front', {speed: front});
  }
}

function setPrimaryTouchMove(evt, socket) {
  if (evt.changedTouches[0].clientX > document.body.clientWidth / 2) {
    var centerLeft = (230 - 100) / 2;
    var centerTop = (230 - 100) / 2;
    $('.primary-control-center').css('left', centerLeft).css('top', centerTop);
    return;
  }

  var primaryLeft = evt.changedTouches[0].clientX - $('.primary-control').offset().left - ($('.primary-control-center').outerWidth() / 2);
  var primaryTop = evt.changedTouches[0].clientY - $('.primary-control').offset().top - ($('.primary-control-center').outerWidth() / 2);

  var primaryX = primaryLeft + 50 - 115;
  var primaryY = primaryTop + 50 - 115;

  var dist = Math.sqrt(((primaryLeft + 50) - 230 / 2) * ((primaryLeft + 50) - 230 / 2)
    + (primaryTop + 50 - 230 / 2) * (primaryTop + 50 - 230 / 2));

  if (dist > 230 / 2) {
    var destY = evt.changedTouches[0].clientX - $('.primary-control').offset().left;
    var destX = evt.changedTouches[0].clientY - $('.primary-control').offset().top;

    var k = (115 - destY) / (destX - 115);
    var h = -115 - 115 * k;

    var a = 1 + k * k;
    var b = 2 * k * (h + 115) - 230;
    var c = 115 * 115;

    var x1 = (- b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    var x2 = (- b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);

    // bug
    var temp = destX;
    destX = destY;
    destY = temp;

    var centerX = destX - 115;
    var centerY = destY - 115;
    var x = 0;
    var y = 0;

    if (centerX > 0 && centerY > 0) {
      x = getMax(x1, x2);
      y = getY(x).y1;
    }
    else if (centerX > 0 && centerY < 0) {
      x = getMax(x1, x2);
      y = getY(x).y2;
    }
    else if (centerX < 0 && centerY > 0) {
      x = getMin(x1, x2);
      y = getY(x).y1;
    } else {
      x = getMin(x1, x2);
      y = getY(x).y2;
    }

    primaryLeft = x - 50;
    primaryTop = y - 50;

    primaryX = x - 115;
    primaryY = y - 115;
  }

  $('.primary-control-center').css('left', primaryLeft).css('top', primaryTop);


  if (primaryX > 0 && primaryY > 0) {
    var counterClockwise = Math.abs(primaryX) / 115;
    var down = Math.abs(primaryY) / 115;
    console.log(counterClockwise, down);
    socket.emit('counter-clockwise', {speed: counterClockwise});
    socket.emit('down', {speed: down});
  }
  else if (primaryX > 0 && primaryY < 0) {
    var counterClockwise = Math.abs(primaryX) / 115;
    var up = Math.abs(primaryY) / 115;
    console.log(counterClockwise, up);
    socket.emit('counter-clockwise', {speed: counterClockwise});
    socket.emit('up', {speed: up});
  }
  else if (primaryX < 0 && primaryY > 0) {
    var clockwise = Math.abs(primaryX) / 115;
    var down = Math.abs(primaryY) / 115;
    console.log(clockwise, down);
    socket.emit('clockwise', {speed: clockwise});
    socket.emit('down', {speed: down});
  } else {
    var clockwise = Math.abs(primaryX) / 115;
    var up = Math.abs(primaryY) / 115;
    console.log(clockwise, up);
    socket.emit('clockwise', {speed: clockwise});
    socket.emit('up', {speed: up});
  }
}
function getY(x) {
  return y = {
    y1: 115 + Math.sqrt(115 * 115 - (x - 115) * (x - 115)),
    y2: 115 - Math.sqrt(115 * 115 - (x - 115) * (x - 115))
  }
}
function getMax(x1, x2) {
  return x1 > x2 ? x1 : x2;
}
function getMin(x1, x2) {
  return x1 < x2 ? x1 : x2;
}

function show(event) {
  var infoDiv = document.getElementById('infoDiv');
  infoDiv.style.display = "block";
  infoDiv.innerHTML = mouseX + " " + mouseY;
  infoDiv.style.left = mouseX + 10 + "px";
  infoDiv.style.top = mouseY + 10 + "px";    
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
