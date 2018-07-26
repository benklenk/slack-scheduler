import express from 'express'
import axios from 'axios'
const app = express()

import { getAuthUrl, getToken, createEvent } from './calendar'

import { User } from './models'
import './slack'

import bodyParser from 'body-parser'

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.post('/slack', (req, res) => {
  // console.log("SLACK CONFIRMATION***********", req.body);
  let payload = JSON.parse(req.body.payload)
  let user = payload.user.id
  let data = JSON.parse(payload.actions[0].value)
  console.log('DATATATAT', data)
  User.findOne({ slackId: user })
    .then((u) => {
      console.log('@@@@@@@@@', u)
      createEvent(u.tokens, data, u)
    })
  // console.log(data, user);
  res.end();
})

app.get("/google/callback", (req, res) => {

  getToken(req.query.code, (err, token) => {
    console.log("TOKEN: @@", token)

    let user = new User({
      slackId: req.query.state,
      tokens: token
    })

    user.save()
    .then(() => {
      res.send("Received code");
    })
  })
})


app.listen(3000)
