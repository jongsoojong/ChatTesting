var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var User = require('./db/users.js');

//Mongoose!!

mongoose.connect('mongodb://jongsoo:jongsoo@ds017070.mlab.com:17070/jongtest')
var db = mongoose.connection;

db.once('open', function(){
  console.log("Power Overwhelming");
})


app.use(express.static("./"))
app.use(bodyParser.json())
var port = process.env.PORT || 8888;

app.get('/', function(req, res){
  res.sendFile("index.html");
})



//AUTH

app.post('/api/user/signup', function(req, res) {
  console.log(req.body)
  var user = new User(req.body);
  user.save()
  //
  // res.json(req.body) WHY?!
})

app.get('/api/user/login', function(req, res){
  User.findOne({'username': req.body})
})


io.sockets.on('connection', function(socket){
  socket.on('send-message', function(data){
    io.sockets.emit('get-message', data)
  })
})

server.listen(port, function(){
  console.log("Conjuring Undead at ", + port)
})
