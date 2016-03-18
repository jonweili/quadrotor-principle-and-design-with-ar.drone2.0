$(document).ready(function(){
  socket = io.connect('http://192.168.199.174:8000');
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

  $('.up').click(function() {
    socket.emit('up', { speed: 0.5 });
  });
  $('.down').click(function() {
    socket.emit('down', { speed: 0.5 });
  });

  $('.clockwise').click(function() {
    socket.emit('clockwise', { speed: 0.5 });
  });
  $('.counter-clockwise').click(function() {
    socket.emit('counter-clockwise', { speed: 0.5 });
  });

  $('.front').click(function() {
    socket.emit('front', { speed: 0.5 });
  });
  $('.back').click(function() {
    socket.emit('back', { speed: 0.5 });
  });
  $('.left').click(function() {
    socket.emit('left', { speed: 0.5 });
  });
  $('.right').click(function() {
    socket.emit('right', { speed: 0.5 });
  });

  isFullScreen = false;
  $('.full-screen').click(function() {
    if (isFullScreen == false) {
      setFullScreen();
      $(this).text('退出全屏');
      isFullScreen = true;
      $('.title').addClass('title-fullscreen');
    } else {
      exitFullScreen();
      $(this).text('全屏');
      isFullScreen = false;
      $('.title').removeClass('title-fullscreen');
    }
  })
});

function setFullScreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  } else if (document.body.mozRequestFullScreen) {
    document.body.mozRequestFullScreen();
  } else if (document.body.webkitRequestFullscreen) {
    document.body.webkitRequestFullscreen();
  } else if (document.body.msRequestFullscreen) {
    document.body.msRequestFullscreen();
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
