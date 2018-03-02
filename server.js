var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var config = require('./server/config/main');
var passport = require('passport');

var app         = express();
//connect to database
var database;
if (process.env.NODE_ENV === 'production') {
  database = config.database;
} else {
  database = config.devdatabase;
}
mongoose.connect(database);

//On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + database);
});

//On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err);
});

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// log to console
app.use(morgan('dev'));

app.use(passport.initialize());
require('./server/config/passport')(passport);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

var index = require('./server/routes/index');
var auth = require('./server/routes/auth');
var users = require('./server/routes/users')(passport);
var api = require('./server/routes/api')(passport);

app.use('/', index);
app.use('/auth', auth);
app.use('/users', users);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
};

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

// Start the server
app.listen(config.port);
console.log('Listening on port: ' + config.port);