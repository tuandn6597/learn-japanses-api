const mongoose = require('mongoose')
const base = require('../../helper/_base_schema')
const ALPLABET_TYPE = {
  HIRAGANA: 'hiragana',
  KATAKANA: 'katakana'
}
const alplabetSchema = new mongoose.Schema({
  ...base,
  japaneseLetter: {
    type: String,
    required: true
  },
  translateLetter: {
    type: String,
    required: true
  },
  letterImageUrl: {
    type: String,
    required: true
  },
  letterDetailImageUrl: {
    type: String,
    required: true
  },
  alplabetType: {
    type: String,
    default: ALPLABET_TYPE.HIRAGANA
  }
})
const Alplabet = mongoose.model('Alplabet', alplabetSchema)
Alplabet.ALPLABET_TYPE = ALPLABET_TYPE;
module.exports = Alplabet