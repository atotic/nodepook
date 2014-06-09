// angular_play.js
     angular.module('notesApp',[])
        .controller('MainCtrl', [ function() {
          this.notes = [
          { id: 1, label: 'First', done: false, assignee: 'Shyam'},
          { id: 2, label: 'Second', done: false},
          { id: 3, label: 'Third', done: true},
          { id: 4, label: 'Fourth', done: false, assignee: 'Brad'},
          ]
          this.getNoteClass = function(status) {
            return {
              done: status,
              pending: !status
            }
          }
        }]);
