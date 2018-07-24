const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var models = require('./models.js');

var User = models.User
var Task = models.Task
var Meeting = models.Meeting
var Request = models.Request

var app = express();
const server = require('http').Server(app);
var oAuth2Client;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile'];

mongoose.connection.on('connected', function(){
  console.log("Successfully Connected");
})
mongoose.connect(process.env.MONGODB_URI);


var token = null;

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;

  oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[1] + "/google/callback");

  User.findOne({slackId: "d"}, function(err, result){
    if(err || result===null){
      console.log("user does not exist");
    }else{
       token = result.gAccessToken
    }
  })

  console.log(token)
  // Check if we have previously stored a token.
  fs.readFile(JSON.stringify(token), (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function listEvents(auth) {
  console.log("Successfully Connected to your googleCalendar ")
}

app.get('/google/callback', (req, res) => {
  console.log(req.query.code);
  code = req.query.code;

  oAuth2Client.getToken(code, (err, token1) => {
    if (err) return function(err){
      console.log('we got an error over here')
    };
    oAuth2Client.setCredentials(token1);
    // Store the token to disk for later program executions
    // fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    //   if (err) console.error(err);
    //   console.log('Token stored to', TOKEN_PATH);
    // });
    token = token1;
    console.log(token)

    var newUser = new User({
      gProfileId: 'HELLO',
      gAccessToken: token.access_token,
      gRefreshToken: token.expiry_date,
      slackId: 'helloImASlackUser',
      slackUsername: 'benny',
      slackEmail: 'benito@slack.org',
      slackDMiD: []
    })
    newUser.save(function(err,result){
      if(err){
        console.log(err)
      }else{
        console.log(result);
      }
    })

      callback(oAuth2Client);
  });

  res.send('user created motha fucka');
})

app.listen(3000);
