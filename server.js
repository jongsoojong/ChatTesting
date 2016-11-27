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



//AUTH


app.post('/api/user/signup', function(req, res) {
  console.log(req.body)
  var user = new User(req.body);
  user.save()
  // res.json(req.body) WHY?!
})

app.post('/api/user/getchat', function(req, res){
  console.log("Current Chat" + req.body.currentMessages);
  User.findOne({username: req.body.currentUsername}, function(err, messages){
    res.send(messages)
  })
})

app.post('/api/user/mainchat', function(req, res){
  console.log("current username " + req.body.currentUsername);
  User.findOneAndUpdate({username: req.body.currentUsername}, {$push: { messages: req.body.currentMessages } }, {upsert:true}, function(err, results){
    console.log("Current User ", results)
    res.send(results)
  })
});


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


io.sockets.on('connection', function(socket){
  socket.on('send-message', function(data){
    io.sockets.emit('get-message', data)
  })
})

server.listen(port, function(){
  console.log("Conjuring Undead at ", + port)
})
