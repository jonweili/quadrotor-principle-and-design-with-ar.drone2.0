var express = require('express');
var http = require('http');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

var server = http.createServer(app);
server.listen(3000, function() {
  console.log('Express server listening on port: 3000');
})
