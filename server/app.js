var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

// var mongoose = require('mongoose');
// var models = require('./models.js');
// var User = models.User
// var Document = models.Document

var routes = require('./routes.js');


var app = express();
const server = require('http').Server(app);
// const io = require('socket.io')(server);

// app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

server.listen(process.env.PORT || 3000)
