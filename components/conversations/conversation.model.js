const mongoose = require('mongoose')
const base = require('../../helper/_base_schema')
const converSchema = new mongoose.Schema({
    ...base,
    person_name_jp: String,
    person_name_mean: String,
    conversation_jp: String,
    pronunciation: String,
    conversation_mean: String
})

module.exports = mongoose.model('Conversation', converSchema)
