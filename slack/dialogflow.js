const projectId = 'beninato-f3912'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const query = 'remind me to eat';
const languageCode = 'en-US';
// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();
// Define session path

export function runSession(slackId, query) {
  const sessionPath = sessionClient.sessionPath(projectId, slackId);
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode
      }
    }
  }
  // Send request and log result
  return sessionClient.detectIntent(request).then(responses => {
    // console.log('Detected intent')
    const result = responses[0].queryResult
    // console.log(`  Query: ${result.queryText}`)
    // console.log(result)
    // console.log(`  Response: ${result.fulfillmentText}`)
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`)
      return result
      console.log('RESPONSE: ' + result)
    } else {
      console.log(`  No intent matched.`)
    }
  }).catch(err => {
    console.error('ERROR:', err)
  })
}




//   {"fulfillmentMessages": [
//     {
//       "platform": "PLATFORM_UNSPECIFIED",
//       "text": {
//         "text": ["Ayyeee I have created a reminder to eat on 2018-07-26"]
//       },
//       "message": "text"
//     }
//   ],
//   "outputContexts": [],
//   "queryText": "remind me to eat tomorrow",
//   "speechRecognitionConfidence": 0,
//   "action": "",
//   "parameters": {
//     "fields": {
//       "setTask": {
//         "stringValue": "remind",
//         "kind": "stringValue"
//       },
//       "date-period": {
//         "stringValue": "",
//         "kind": "stringValue"
//       },
//       "date": {
//         "stringValue": "2018-07-26T12:00:00-07:00",
//         "kind": "stringValue"
//       },
//       "Subject": {
//         "stringValue": "eat",
//         "kind": "stringValue"
//       }
//     }
//   },
//   "allRequiredParamsPresent": true,
//   "fulfillmentText": "Ayyeee I have created a reminder to eat on 2018-07-26",
//   "webhookSource": "",
//   "webhookPayload": null,
//   "intent": {
//     "inputContextNames": [],
//     "events": [],
//     "trainingPhrases": [],
//     "outputContexts": [],
//     "parameters": [],
//     "messages": [],
//     "defaultResponsePlatforms": [],
//     "followupIntentInfo": [],
//     "name": "projects/beninato-f3912/agent/intents/6766dcfd-701b-4a49-9294-e7f806c4ad7d",
//     "displayName": "Reminders",
//     "priority": 0,
//     "isFallback": false,
//     "webhookState": "WEBHOOK_STATE_UNSPECIFIED",
//     "action": "",
//     "resetContexts": false,
//     "rootFollowupIntentName": "",
//     "parentFollowupIntentName": "",
//     "mlDisabled": false
//   },
//   "intentDetectionConfidence": 1,
//   "diagnosticInfo": null,
//   "languageCode": "en-us"
// }
