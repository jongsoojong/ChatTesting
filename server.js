var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


app.use(express.static("./"))
var port = process.env.PORT || 8888;

// app.get('/', function(req, res){
//   res.sendFile("index.html");
// })

io.sockets.on('connection', function(socket){
  socket.on('send-message', function(data){
    io.sockets.emit('get-message', data)
  })
})



server.listen(port, function(){
  console.log("Conjuring Undead at ", + port)
})
