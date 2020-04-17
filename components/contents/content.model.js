const mongoose = require('mongoose')
const base  = require('../../helper/_base_schema')
const contentSchema = new mongoose.Schema({
  ...base,
  text: {
    type: String,
    required: true
  },
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: 'Avatar'
  },
  mean: {
    type: String,
    required: true
  },
  pronounce: {
    type: String
  },
  language: {
    type: String
  }
})

module.exports = mongoose.model('Content', contentSchema)
