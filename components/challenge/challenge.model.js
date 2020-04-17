const mongoose = require('mongoose')
const base  = require('../../helper/_base_schema')
const json = require('../../assets/challenge.json')

const challengeSchema = new mongoose.Schema({
  ...base,
    level: Number,
    choice_1 : String,
    choice_1_voice : String,
    choice_2 : String,
    choice_2_voice : String,
    answer : Number,
    question : String,
    explanation : String,
    image : String,
})
const Challenge = mongoose.model('Challenge', challengeSchema)
// Challenge.insertMany(json, function(err){
//     if(err) console.log(err);
//     console.log("Insert challenge");
// })
module.exports = Challenge
