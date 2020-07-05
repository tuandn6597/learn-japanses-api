const mongoose = require('mongoose')
const base = require('../../helper/_base_schema')
const answerSchema = new mongoose.Schema({
    vocabulary: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vocabulary'
    },
    correct: {
        type: Boolean,
        default: false
    }
}, { _id: false })
const historySchema = new mongoose.Schema({
    ...base,
    topic: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topic'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    correctAnswers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Vocabulary'
        }
    ],
    incorrectAnswers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Vocabulary'
        }
    ],
    notAnswers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Vocabulary'
        }
    ]
})
module.exports = mongoose.model('History', historySchema)