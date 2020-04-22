const mongoose = require('mongoose')
const base = require('../../helper/_base_schema')
const type_login = {
  FB: 'FB',
  UN: 'UN', //username
  EM: 'EM' //email
}
const userSchema = new mongoose.Schema({
  ...base,
  email: {
    type: String,
    unique: true,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  isGuest: {
    type: Boolean,
    default: true
  },
  fbId: String,
  typeLogin: {
    type: String,
    default: type_login.UN
  },
  dynamic_props: {

  },
  userForWeb: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  socketId: {
    type: String
  },
  phoneNumber: {
    type: String,
    minlength: 9
  },
  experience: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 0
  },
  countOnline: {
    type: Number,
    default: 0
  },
  sumQuestion: {
    type: Number,
    default: 12
  },
  numberAnswer: {
    type: Number,
    default: 4
  },
  lession_number: {
    type: Number,
    default: 1
  },
  friends: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: 'Avatar'
  },
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course'
    }
  ],
  histories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'History'
    }
  ],
  archivements: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Archivement'
    }
  ],
  pushToken: { type: String, default: '' }
})
userSchema.index({ username: 1 }, { unique: true })
const User = mongoose.model('User', userSchema)
User.type_login = type_login
module.exports = User
