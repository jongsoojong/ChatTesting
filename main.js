
var socketApp = angular.module('socketApp', ['ui.router']);


//CONTROLLERS


socketApp.controller('chatController', function($scope, socket){
  var vm = this;
  vm.msgs = [];
  vm.friends = [];
  vm.currentChat = [];
  vm.sendMessage = function() {
    socket.emit('send-message', vm.msg.text);
    vm.msg.text = '';
  };

  socket.on('get-message', function(data){
    vm.msgs.push(data);
    $scope.$digest();
  });

});

socketApp.controller('signUpController', function($scope, $state, $http){
  var vm = this;


  vm.createUser = function() {
    if(vm.newUser.username.length <= 6 || vm.newUser.password.length <= 6) {
      alert("Username or password is too short! ");
    } else {
      $http.post('/api/user/signup', vm.newUser)
      .success(function(res){

      }).error(function(err){
        console.log(err);
      })
    }
  }

})

//MAKE NAV CONTROLLER

//ROUTERS

socketApp.config(function($stateProvider){

  $stateProvider.state('signUp', {
    url: "/signup",
    templateUrl: "./templates/signup.html" ,
    controller: "signUpController as vm"
  })

  $stateProvider.state('chatRoom', {
    url: "/main",
    templateUrl: "./templates/chatroom.html" ,
    controller: "chatController as vm"
  })



})


//FACTORIES (Hellions, Siege Tanks, and Thors! Oh My!)

socketApp.factory('socket', function(){
  var socket = io.connect('http://localhost:8888');
  return socket;
})
