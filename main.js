
var socketApp = angular.module('socketApp', ['ui.router']);


//CONTROLLERS


socketApp.controller('chatController', function($scope, $state, $http, $location, socket, userInfo, getChatData){
  var vm = this;
  vm.msgs = [];
  var thisDate = new Date;
  vm.messagePrompt =  userInfo.currentUsername + " (" + thisDate.toLocaleString() + ")" + ' : '

  if(userInfo.isLogged === false){
    $location.path('/');
  }
  // gonna make a global init, followed by 4 other chat room init.
  vm.init = function() {
    $http.get('/api/user/getmainchat')
    .then(function(results){
      vm.msgs = results.data.chat
    })
  }

  vm.sendMessage = function() {
    socket.emit('send-message', vm.messagePrompt + vm.msg.text);
    vm.msg.text = '';
  };

  socket.on('get-message', function(message){
    userInfo.currentMessages = message;
    vm.msgs.push(message);
    $scope.$digest();
    // $http.post('/api/user/mainchat', userInfo)
    // .success(function(res){
    //   console.log("updated!")
    // }).error(function(err){
    //   console.log("ERROR", err);
    // })
  });

});

socketApp.controller('signUpController', function($scope, $state, $http, $location){
  var vm = this;

  vm.createUser = function() {
    if(vm.newUser.username.length <= 6 || vm.newUser.password.length <= 6) {
      alert("Username or password is too short! ", $location);
    } else {
      alert("Account Created!");
      console.log(vm.newUser);
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

socketApp.controller('loginController', function($scope, $state, $http, $location, userInfo){
  var vm = this;

  vm.login = function() {
    $http.post('/api/user/login', vm.userlogin)
    .success(function(res){
      console.log(res)
      if(res === '') {
        alert("Sorry that account/password is incorrect!");
        $location.path("/login")
      } else {
        alert("Logged in!")
        $location.path("/main");
        userInfo.currentUsername = vm.userlogin.username;
        console.log(userInfo)
        userInfo.isLogged = true;
      }
    }).error(function(err){
      console.log(err);
    })

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

socketApp.factory('socket', function($location){
  var socket = io.connect($location.absUrl());
  return socket;
})

socketApp.factory('userInfo', function($http){

  var currentUsername = '';
  var currentMessages = '';
  var isLogged = false;

  return {
    currentUsername: currentUsername,
    currentMessages: currentMessages,
    isLogged : isLogged
  }

})

socketApp.factory('makeChat', function($http){

  var makeData = function(chatName){
    return $http({
      method:'POST',
      url: '/api/newChat',
      data: {
        "name": name,
        "chat": []
      }
    })
  }

})

socketApp.factory('updateChat', function($http){

  var getData = function(chatName){
    return $http({
      method:'POST',
      url: '/api/newChat',
      data: {
        "name": name,
        "chat": []
      }
    })
  }

})


socketApp.factory('getChatData', function($http){

  var getData = function(data){
    return $http.post('/api/user/getchat', data)
    .then(function(results){
      return results;
    })
  }

  return {
    getData: getData
  }

})
