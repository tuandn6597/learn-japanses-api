const mongoose = require('mongoose')
const base = require('../../helper/_base_schema')
const historySchema = new mongoose.Schema({
    ...base,
    topic: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topic'
    },
    complete: {
        type: Boolean,
        default: false
    },
    answers: [{
        by: mongoose.Schema.ObjectId,
        correct: {
            type: Boolean,
            default: false
        }
    }],
    finish_question: {
        type: Number,
        default: 0
    }
})
module.exports = mongoose.model('History', historySchema)