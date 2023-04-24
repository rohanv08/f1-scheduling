const http = require('http')
var express = require('express');
var bodyParser = require('body-parser')
var logger = require('morgan');
var fs = require("fs")
var ip = require("ip");

const ip_details = {
  "server_host": ip.address(),
  "server_port":"8080"
}
const ip_details_json = JSON.stringify(ip_details);
fs.writeFile('../client/src/config.json', ip_details_json, (error) => {
    if (error) {
      console.error(error);
      throw error;
  }
})

const port = 8080
var app = express();
var inputRouter = require('./routes/input');
var resultsRouter = require('./routes/results');
// Create a server object:

app.use(bodyParser())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.listen(port, function () {
  console.log('189 Backend Listening On ' + port + '!');
});
app.get('', (req, res) => {
  return res.redirect('/');
});
let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);

app.use('/', inputRouter)
app.use('/results', resultsRouter)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;