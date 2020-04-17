const { db, error } = require('../../helper')
const question = require('../../helper/question')
const { Topic, User } = db
const historyService = require('../histories/history.service')
const avatarCtrl = require('../avatars/avatar.controller')
const videoCtrl = require('../videos/video.controller')

exports.create = (body) => Topic.create(body);

exports.getAll = async (user) => {
    const { lession_number = 1 } = user;
    const topics = await Topic.find().select('-vocabularies').lean();
    return topics.map(topic => {
        return {
            ...topic,
            avatar: avatarCtrl.getImgUrl(topic.avatar),
            video: videoCtrl.getVideo(),
            lock: !(lession_number === parseInt(topic.lesson_number))
        }
    })
}

exports.getById = (id) => Topic.findById(id).populate('vocabularies');

exports.getDetails = (id, isGuest = false) => {
    if (isGuest)
        throw error.requiredLogin
    return this.getById(id);
}

//todo
exports.makeQuestion = async ({ id, sumQuestion, _id, numberAnswer, isGuest, userForWeb }) => {
    if (isGuest)
        throw error.requiredLogin

    let vocabularies = [];
    const { histories } = await User.findById(_id).populate({ path: 'histories', populate: { path: 'topic', populate: 'vocabularies' } })
    const history = histories.find(history => history.topic._id.toString() === id)
    if (history) {
        const { topic, answers } = history;
        vocabularies = topic.vocabularies
        answers.forEach(item => {
            const index = vocabularies.findIndex(voca => (voca._id.toString() === item._id.toString()) && item.correct);
            index >= 0 && vocabularies.splice(index, 1);
        })
    }
    else {
        const topics = await this.getById(id);
        if (!topics)
            throw error.topicNotFound
        vocabularies = topics.vocabularies
    }
    return question._makeQuestion({ type: 'topic', numberQuestion: sumQuestion, numberAnswer, userForWeb }, vocabularies)
}

exports.randomTopic = async () => {
    const topics = await topic.find().lean()
    const topic = topics[Math.floor(Math.random() * topics.length)];
    return {
        ...topics,
        avatar: avatarCtrl.getImgUrl(topic.avatar)
    }
}



