var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var User = require('./db/users.js');
var Chat = require('./db/chats.js')

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


//initiate mainchat


Chat.findOne({name: "main"}, function(err, user){
  console.log("THE USER ", user)
  if(user === null) {
    Chat.create({
      "name": "main",
      "chat": []
    })
  } else {
    console.log("Main Exists!")
  }
})


//AUTH


app.post('/api/user/signup', function(req, res) {
  console.log(req.body)
  var user = new User(req.body);
  user.save()
  // res.json(req.body) WHY?!
})

app.get('/api/user/getmainchat', function(req, res){
  console.log("Current Chat" + req.body);
  Chat.findOne({name: 'main'}, function(err, messages){
    res.send(messages)
  })
})


app.post('/api/user/login', function(req, res) {
  console.log(req.body)
  User.findOne(req.body, function(err, user){
    console.log("THE USER ", user)
    res.send(user);
  })
})



//
// app.get('/api/getChat', function(req, res){
//   Chat.findOne(req.body)
//   .then(function(results){
//     res.send(results);
//   })
// })
var connections = [];

io.sockets.on('connection', function(socket){
  socket.removeAllListeners()
  socket.on('disconnect', function () {
    setTimeout(function () {
         //do something
    }, 10000);
  });
  socket.on('send-message', function(data){
    console.log("SOCKETDATA ",data)
    io.sockets.emit('get-message', data)
    Chat.findOneAndUpdate({name: 'main'}, {$push: { chat: data } }, {upsert:true}, function(err, message){
      console.log("AHHHHH!")
    })
  })
})

server.listen(port, function(){
  console.log("Conjuring Undead at ", + port)
})
