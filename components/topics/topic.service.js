const { db, error } = require('../../helper')
const question = require('../../helper/question')
const { Topic, User, History } = db
const historyService = require('../histories/history.service')
const avatarCtrl = require('../avatars/avatar.controller')
const videoCtrl = require('../videos/video.controller')
const { translate } = require("google-translate-api-browser");




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

exports.makeQuestion = async ({ id, sumQuestion, _id, numberAnswer, isGuest, userForWeb }) => {
    if (isGuest)
        throw error.requiredLogin

    const condition = {
        topic: id,
        user: _id
    }
    const [history, topic] = await Promise.all([
        History.findOne(condition).populate('notAnswers'),
        this.getById(id)
    ])
    if (!topic)
        throw error.topicNotFound
    let vocabularies = topic.vocabularies;
    if (history.correctAnswers.length < topic.vocabularies.length) {
        vocabularies = history.notAnswers
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

const translateToVietNamese = (text) => {
    return new Promise((resolve, reject) => {
        translate(text, { from: 'ja', to: 'vi' })
            .then(res => {
                console.log('res?.text:', res.text)
                resolve(res.text)
            })
            .catch(err => {
                reject(error)
            });
    })
}

exports.translate = async () => {
    const topics = await Topic.find().lean()
    const updated = topics.map(async topic => {
        const mean = await translateToVietNamese(topic.title)
        await Topic.findByIdAndUpdate(topic._id, { mean }, { new: true })
    })
    await Promise.all(updated)
}





