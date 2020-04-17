const mongoose = require('mongoose');
const base = require('../../helper/_base_schema')
const RoomConfigSchema = new mongoose.Schema({
    ...base,
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        min: 2
    },
    factorX: {
        type: Number,
        min: 1,
        default: 1
    },
    scores: [Number],
    final_rank_credits: [Number],
    // sudden-death
    factorX_SD: {
        type: Number,
        min: 1,
        default: 1
    },
    maxQuestions: {
        type: Number,
        min: 1,
        default: 1
    },
    // scores_SD: [Number],
    score_SD: {
        type: Number,
        default: 1
    },
    orderCredits: [Number],
    medals: {
        ruby: Number,
        diamond: Number,
        platinum: Number
    },
    boosters: [
        { chances: Number, gold: Number, description: String }
    ],
    stopwatch: {
        type: Number,
        default: 60
    },
});

const RoomConfig = mongoose.model('RoomConfig', RoomConfigSchema);

module.exports = RoomConfig;