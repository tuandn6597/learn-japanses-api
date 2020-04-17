const mongoose = require('mongoose')
const base  = require('../../helper/_base_schema')
const courseSchema = new mongoose.Schema({
  ...base,
  title: {
    type: String,
    required: true
  },
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: 'Avatar'
  },
  contents: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Content'
    }
  ]
})

module.exports = mongoose.model('Course', courseSchema)
