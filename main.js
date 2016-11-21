var socketApp = angular.module('socketApp', []);

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

socketApp.factory('socket', function(){
  var socket = io.connect('http://localhost:8888');
  return socket;
})
