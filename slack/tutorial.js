// const { IncomingWebhook, WebClient } = require('@slack/client');
// //
// // console.log('Getting started with Slack Developer Kit for Node.js');
// //
// const web = new WebClient(process.env.SLACK_TOKEN);

// //
// // timeNotification.send(`The current time is ${currentTime}`, (error, resp) => {
// //   if (error) {
// //     return console.error(error);
// //   }
// //   console.log('Notification sent');
// //   console.log('Waiting a few seconds for search indexes to update...');
// //   setTimeout(() => {
// //     console.log('Calling search.messages');
// //     web.search.messages({ query: currentTime })
// //       .then(resp => {
// //         if (resp.messages.total > 0) {
// //           console.log('First match:', resp.messages.matches[0]);
// //         } else {
// //           console.log('No matches found');
// //         }
// //       })
// //       .catch(console.error)
// //   }, 12000);
// // });
//
// const { RTMClient, WebClient } = require('@slack/client');
// const bodyParser = require('body-parser')
// const express = require('express')
// var app = express()
//
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: false}))
//
// const token = process.env.BOT_USER_ACCESS
// const rtm = new RTMClient(token);
// rtm.start();
//
// const web = new WebClient(token)
//
// rtm.on('message', event => {
//   console.log(event)
//   if (!event.bot_id) {
//     return
//     runSession(event.text, runSessionCallback, event)
//   } else {
//     // do nothing
//   }
// })
//
// //Dialogflow
// const projectId = 'beninato-f3912'; //https://dialogflow.com/docs/agents#settings
// const sessionId = 'quickstart-session-id';
// const languageCode = 'en-US';
// // Instantiate a DialogFlow client.
// const dialogflow = require('dialogflow');
// const sessionClient = new dialogflow.SessionsClient();
// // Define session path
// const sessionPath = sessionClient.sessionPath(projectId, sessionId);
//
// function runSession(query, callback, event) {
//   // The text query request.
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: query,
//         languageCode: languageCode
//       }
//     }
//   }
//   // Send request and log result
//   sessionClient.detectIntent(request).then(responses => {
//     console.log('Detected intent')
//     const result = responses[0].queryResult
//     console.log(`  Query: ${result.queryText}`)
//     console.log(result)
//     console.log(`  Response: ${result.fulfillmentText}`)
//
//     if (!result.allRequiredParamsPresent) {
//       // request.session = sessionPath;
//       callback(result.fulfillmentText)
//     }
//     if (result.intent) {
//       console.log(`  Intent: ${result.intent.displayName}`)
//     } else {
//       console.log(`  No intent matched.`)
//     }
//   }).catch(err => {
//     console.error('ERROR:', err)
//   })
// }
//
// function runSessionCallback(query) {
//   // The text query request.
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: query,
//         languageCode: languageCode
//       }
//     }
//   }
//   // Send request and log result
//   sessionClient.detectIntent(request).then(responses => {
//     const result = responses[0].queryResult
//
//     console.log('Detected intent')
//
//     console.log(`  Query: ${result.queryText}`)
//     console.log(result)
//     console.log(`  Response: ${result.fulfillmentText}`)
//     if (result.intent) {
//       console.log(`  Intent: ${result.intent.displayName}`)
//     } else {
//       console.log(`  No intent matched.`)
//     }
//   }).catch(err => {
//     console.error('ERROR:', err)
//   })
// }

import {runSession} from './dialogflow.js'

const {RTMClient, WebClient} = require('@slack/client');
const bodyParser = require('body-parser')
const express = require('express')
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const token = process.env.BOT_USER_ACCESS
const rtm = new RTMClient(token);
rtm.start();

// const timeNotification = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
// const currentTime = new Date().toTimeString();
const web = new WebClient(token)

rtm.on('message', async (event) => {
  console.log('TEXT: ' + event.text)
  console.log('BOT_ID: ' + event.bot_id)

  if (event.bot_id)
    return;

  await runSession(event.user, event.text).then((resp) => {
    if (!resp.allRequiredParamsPresent) {
      rtm.sendMessage(resp.fulfillmentText, event.channel).catch(console.error())
    } else {
      web.chat.postMessage({
        channel: event.channel,
        'text': 'Add an event on ' + new Date(resp.parameters.fields.date.stringValue) + ' titled ' + resp.parameters.fields.Subject.stringValue + '?',
        "attachments": [
          {
            "fallback": "You are unable to choose a game",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
              {
                "name": "option",
                "text": "Confirm",
                "type": "button",
                "value": 'Confirm',
                "confirm": {
                  "title": "Are you sure?",
                  "ok_text": "Yes",
                  "dismiss_text": 'No'
                }
              }, {
                "name": "option",
                "text": "Nevermind",
                "type": "button",
                "value": "Nevermind"
              }
            ]
          }
        ]
      })
    }
  })
})
