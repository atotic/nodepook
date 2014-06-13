// angular_play.js

function MainController($scope, $log) {
  $log.log("MainController created");
  this.notes = [
    { id: 1, label: 'First', done: false, assignee: 'Shyam'},
    { id: 2, label: 'Second', done: false},
    { id: 3, label: 'Third', done: true},
    { id: 4, label: 'Fourth', done: false, assignee: 'Brad'},
  ];
  this.username = "ctrl user";
  this.getNoteClass = function(status) {
    return {
      done: status,
      pending: !status
    }
  };
  this.change = function() {
    this.username = 'changed';
  }  
}
angular.module('notesApp',[])
  .controller('MainCtrl', [ '$scope', '$log', MainController]);
