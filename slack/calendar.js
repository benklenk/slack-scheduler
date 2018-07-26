import {google} from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar']
import { Model } from './models'

function getClient() {
  return new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.NGROK + "/google/callback");
}

export function getAuthUrl(state) {
  return getClient().generateAuthUrl({access_type: 'offline', scope: SCOPES, state});
}

export function getToken(code, cb) {
  getClient().getToken(code, cb)
}

export function refreshToken(token) {
  let client = getClient();
  client.setCredentials(token);
  return new Promise((resolve, reject) => {
    client.refreshAccessToken((err, token) => {
      if (err)
        reject(err)
      resolve(token)
    })
  })
};

export function createEvent(token, data, user) {
  console.log("IN CREATE EVENT");
  let client = getClient();
  client.setCredentials(token);

  const calendar = google.calendar({version: 'v3', auth: client})

  console.log(data)
  let date = new Date(data.date)
  let start = new Date(data.startTime)
  let end = new Date(data.endTime)
  let subject = data.subject

  start.setDate(date.getDate());
  end.setDate(date.getDate());
  // console.log(new Date(Date.now() + 90000).toISOString());
  calendar.events.insert({
    calendarId: 'primary',
    resource: {
      summary: subject,
      start: {
        dateTime: start.toISOString()
      },
      end: {
        dateTime: end.toISOString()
      }
    }
  }, (err, resp) => {
    if(err){
      console.log("ERROR CREATING EVENT", err);
    }else{
      console.log('BINGO HERE IT IS  ', resp)
      // var newMeeting = new Meeting({
      //   startTime: data.startTime,
      //   endTime: data.endTIme,
      //   InviteesList: data.invitees
      //   subject:
      //   location: data["location"]? data['location'] : ''
      //   CreatedAt: new Date(),
      //   requesterID: user.slackId,
      //   googleID: ''
      // })

      // newMeeting.save().then(()=> console.log("saved"))

    }

    // axios(`https://accounts.google.com/o/oauth2/revoke?token=${token.access_token}`)
  })
}
