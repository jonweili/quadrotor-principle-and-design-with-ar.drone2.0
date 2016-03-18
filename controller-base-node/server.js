var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var arDrone = require('ar-drone');
var client = arDrone.createClient();
client.disableEmergency();

server.listen(8000, function() {
  console.log('Express server listening on port: 8000');
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

io.on('connection', function (socket) {
  console.log('connected!');
  socket.on('take-off', function (data) {
    console.log('take-off', data);
    client.takeoff();
  });
  socket.on('land', function (data) {
    console.log('land', data);
    client.land();
  });
  socket.on('stop', function (data) {
    console.log('stop', data);
    client.stop();
  });

  socket.on('up', function (data) {
    console.log('up', data);
    client.up(data.speed);
  });
  socket.on('down', function (data) {
    console.log('down', data);
    client.down(data.speed);
  });

  socket.on('clockwise', function (data) {
    console.log('clockwise', data);
    client.clockwise(data.speed);
  });
  socket.on('counter-clockwise', function (data) {
    console.log('counter-clockwise', data);
    client.counterClockwise(data.speed)
  });

  socket.on('front', function (data) {
    console.log('front', data);
    client.front(data.speed);
  });
  socket.on('back', function (data) {
    console.log('back', data);
    client.back(data.speed);
  });
  socket.on('left', function (data) {
    console.log('left', data);
    client.left(data.speed);
  });
  socket.on('right', function (data) {
    console.log('right', data);
    client.right(data.speed);
  });

});
