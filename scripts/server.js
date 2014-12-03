#! /usr/bin/env node
var debug = require('debug')('pook');
var app = require('../server/instances/app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening http://localhost: ' + server.address().port);
});
