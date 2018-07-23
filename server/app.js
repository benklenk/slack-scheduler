var express = require('express');
var path = require('path');
var logger = require('morgan');
<<<<<<< HEAD
=======

>>>>>>> nthiebaut
var bodyParser = require('body-parser');

// var mongoose = require('mongoose');
// var models = require('./models.js');
// var User = models.User
// var Document = models.Document

var routes = require('./routes.js');
<<<<<<< HEAD

=======
var auth = require('./auth.js');
>>>>>>> nthiebaut

var app = express();
const server = require('http').Server(app);
// const io = require('socket.io')(server);

<<<<<<< HEAD
// app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
=======

// app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(cookieParser('keyboard cat'));
>>>>>>> nthiebaut

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

<<<<<<< HEAD
app.use('/', routes);
=======
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

>>>>>>> nthiebaut

server.listen(process.env.PORT || 3000)
