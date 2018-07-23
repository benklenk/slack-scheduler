var express = require('express');
var path = require('path');
var logger = require('morgan');

var bodyParser = require('body-parser');

// var mongoose = require('mongoose');
// var models = require('./models.js');
// var User = models.User
// var Document = models.Document

var routes = require('./routes.js');
var auth = require('./auth.js');

var app = express();
const server = require('http').Server(app);
// const io = require('socket.io')(server);


// app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(cookieParser('keyboard cat'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/', auth(passport));

// app.use('/', function(req, res, next){
//   if(!req.user){
//     res.json({
//       success: false,
//       error: "User Not Logged In"
//     })
//   }else{
//     next();
//   }
// })

// app.use('/', routes);


server.listen(process.env.PORT || 3000)
