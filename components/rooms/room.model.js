const mongoose = require('mongoose');
const base = require('../../helper/_base_schema')
const { RoomStatus } = require('../../config')

const RoomUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    socketId: String,
    username: String,
    not_answer: Number,
    true_answer: Number,
    false_answer: Number,
    score: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 0
    },
    join_at: {
        type: Date,
        default: Date.now
    },
    disconnected_at: Date,
    isRealUser: {
        type: Boolean,
        default: true
    },
    avatar: String

}, { _id: false })

const UserAnswerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    answer_id: Number,
    answerAtSecond: {
        type: Number,
        default: 0
    }

}, { _id: false })

const QuestionSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vocabulary'
    },
    question: String,
    answers: [String],
    answer_id: Number,
    user_answers: [UserAnswerSchema]

})

const RoomSchema = new mongoose.Schema({
    ...base,
    sizeRoom: Number,
    code: {
        type: String,
        maxlength: 2
    },
    topic: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topic'
    },
    status: {
        type: String,
        default: RoomStatus.CLOSE
    },
    users: [RoomUserSchema],
    questions: [QuestionSchema]

});

module.exports = mongoose.model('Room', RoomSchema);
