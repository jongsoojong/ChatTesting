
var socketApp = angular.module('socketApp', ['ui.router']);


//CONTROLLERS


socketApp.controller('chatController', function($scope, socket){
  var vm = this;
  vm.msgs = [];
  vm.sendMessage = function() {
    socket.emit('send-message', vm.msg.text);
    vm.msg.text = '';
  };

  socket.on('get-message', function(data){
    vm.msgs.push(data);
    $scope.$digest();
  });

});

socketApp.controller('signUpController', function($scope, $state, $http, $location){
  var vm = this;

  vm.createUser = function() {
    if(vm.newUser.username.length <= 6 || vm.newUser.password.length <= 6) {
      alert("Username or password is too short! ");
    } else {
      alert("Account Created!");
      $location.path("/login");
      $http.post('/api/user/signup', vm.newUser)
      .success(function(res){
        
      }).error(function(err){
        console.log(err);
      })
    }
  }

})

//MAKE LOGIN CONTROLLER

socketApp.controller('loginController', function($scope, $state, $http, $location){
  var vm = this;

  vm.login = function() {
    if(!vm.login.username || !vm.login.password ) {
      alert("please put in username/password");
    } else {
      $location.path("/main")
    }
  }

})

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

  $stateProvider.state('login', {
    url: "/login",
    templateUrl: "./templates/login.html" ,
    controller: "loginController as vm"
  })

  $stateProvider.state('intro', {
    url: "/",
    templateUrl: "./templates/intro.html" ,
  })



})


//FACTORIES (Hellions, Siege Tanks, and Thors! Oh My!)

socketApp.factory('socket', function(){
  var socket = io.connect('http://localhost:8888');
  return socket;
})

socketApp.factory('userInfo', function($http){

  var currentUsername = '';
  var currentPassword = '';

  var getUserInfo = function(userName, userPassword) {
    return $http()
  }


})
