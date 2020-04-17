const mongoose = require('mongoose')
const base = require('../../helper/_base_schema')
const vocabularySchema = new mongoose.Schema({
  ...base,
  text: {
    // name question
    type: String,
    required: true
  },
  mean: {
    type: String,
    required: true
  },
  meaning: {
    type: String
  },
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: 'Avatar'
  },
  pronounce: {
    // url pronouce
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sound: {
    type: String
  },
  kanji_text: {
    type: String
  }
})
module.exports = mongoose.model('Vocabulary', vocabularySchema)
