// angular_play.spec.js

describe('Controller:MainCtrl', function() {

	beforeEach(module('notesApp'));

	beforeEach(inject(function($controller) {
		ctrl = $controller('MainCtrl');
	}));

	it("should have notes", function() {
		chai.assert(ctrl.notes.length > 0, 'has ctrl items');
	});
});
