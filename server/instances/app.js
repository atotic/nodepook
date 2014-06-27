// DEBUG=pook* node ./bin/www

var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');

var auth = require('../routes/auth');

var routes = require('../routes/index');

var app = express();

var homepath = path.resolve(__dirname, '../..');

// view engine setup
app.set('views', path.join(homepath, 'browser/views'));
app.set('view engine', 'jade');

app.use(favicon(homepath + '/browser/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser("WEJNSD<MVCSDKJF"));
app.use(express.static(path.join(homepath, 'browser')));

app.use('/', routes);
app.use('/users',   require('../routes/users'));
app.use('/photos',  require('../routes/photos'));
app.use('/resize',  require('../routes/resize'));
app.use('/angular', require('../routes/angular'));
app.use('/auth',    auth.router);

app.get('/polymer', function stats(req, res, next) {
   res.render('polymer');
 });

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
