var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

if (!process.env.MONGODB_URI)
  throw new Error('uri missing');

mongoose.connect(process.env.MONGODB_URI)

var TaskModel = new Schema({
  subject: {
    type: String,
    required: true
  },
  day: {
    type: Date,
    required: true
  },
  eventID: {
    type: String
  },
  requesterID: {
    type: String
  }
});

var MeetingSchema = new Schema({
  day: {
    type: Date,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  InviteesList: [
    {
      type: ObjectId,
      required: true,
      ref: 'User'
    }
  ],
  subject: {
    type: String
  },
  location: {
    type: String
  },
  meetingLength: {
    type: Number
  },
  Status: {
    type: String
  },
  CreatedAt: {
    type: Date
  },
  requesterID: {
    type: String
  }
});

var UserModel = new Schema({
  tokens: {
    type: Object,
    required: true
  },
  slackId: {
    type: String,
    required: true
  },
  slackUsername: {
    type: String
  },
  slackEmail: {
    type: String
  },
  slackDMiD: {
    type: []
  }
});

var RequestModel = new Schema({
  eventId: {
    type: String
  },
  inviteeId: {
    type: String
  },
  requestID: {
    type: String
  },
  Status: {
    type: String
  }
});

var User = mongoose.model('User', UserModel);
var Task = mongoose.model('Task', TaskModel);
var Meeting = mongoose.model('Meeting', MeetingSchema);
var Request = mongoose.model('Request', RequestModel);

module.exports = {
  Meeting: Meeting,
  User: User,
  Task: Task,
  Request: Request
};
