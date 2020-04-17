const mongoose = require('mongoose')
const { base } = require('../../helper')
const avatarSchema = new mongoose.Schema({
  ...base,
  data: Buffer,
  mime_type: String
})
module.exports = mongoose.model('Avatar', avatarSchema)
