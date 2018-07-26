import {runSession} from './dialogflow.js'
import {getAuthUrl, refreshToken} from './calendar'
const {RTMClient, WebClient} = require('@slack/client');
const bodyParser = require('body-parser')
const express = require('express')
var app = express()
import {User} from './models'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const token = process.env.BOT_USER_ACCESS
const rtm = new RTMClient(token)
const web = new WebClient(token)
rtm.start();

// const timeNotification = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
// const currentTime = new Date().toTimeString();

rtm.on('message', async (event) => {
  // console.log('TEXT: ' + event.text)
  // console.log('BOT_ID: ' + event.bot_id)
  try {
    if (event.bot_id)
      return
    console.log(event.user)
    let user = await User.findOne({slackId: event.user});
    if (!user) {
      return rtm.sendMessage(`Hey buddy why don\'t you sign in before you try that shit: ${getAuthUrl(event.user)}`, event.channel)
    } else if (user.tokens.expiry_date < Date.now() + 100000000) {
      let token = await refreshToken(user.tokens)
      console.log("USER TOKEN: ", token)
      user.tokens = token
      await user.save()
    }
    let resp = await runSession(event.user, event.text)
    // console.log('@@@@@@', resp)
    if (!resp.allRequiredParamsPresent || Object.keys(resp.parameters.fields).length === 0) {
      rtm.sendMessage(resp.fulfillmentText, event.channel).catch(console.error)
    } else {

      let data = {
        time: new Date(resp.parameters.fields.date.stringValue),
        event: resp.parameters.fields.Subject.stringValue
      };
      web.chat.postMessage({
        channel: event.channel,
        'text': 'Add an event on ' + new Date(resp.parameters.fields.date.stringValue) + ' titled ' + resp.parameters.fields.Subject.stringValue + '?',
        "attachments": [
          {
            "fallback": "You tried your best, good job!",
            "color": "#3AA3E3",
            "callback_id": "confirm_button",
            "attachment_type": "default",
            "actions": [
              {
                "name": "option",
                "text": "Confirm",
                "type": "button",
                "value": JSON.stringify(data)

              }, {
                "name": "option",
                "text": "Nevermind",
                "type": "button",
                "style": "danger",
                "value": "Nevermind"
              }
            ]
          }
        ]
      })
    }
  } catch (e) {
    console.log(e)
  }
})
