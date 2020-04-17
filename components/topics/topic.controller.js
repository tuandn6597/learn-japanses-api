const topicService = require('./topic.service')
const avatarCtrl = require('../avatars/avatar.controller')



exports.getDetails = (req, res, next) => {
    const { isGuest } = req.user;
    topicService
        .getDetails(req.params.id, isGuest)
        .then(response => {
            const resp = response.toJSON();
            res.json({
                ...resp,
                vocabularies: resp.vocabularies.map(item => ({ ...item, avatar: avatarCtrl.getImgUrl(item.avatar) })),
                sumVocabulary: resp.vocabularies.length
            })
        })
        .catch(e => next(e))
}

exports.getAll = (req, res, next) => {
    topicService
        .getAll(req.user)
        .then(response => res.json(response))
        .catch(e => next(e))
}

exports.leanTopic = (req, res, next) => {
    const { sumQuestion, _id, numberAnswer, isGuest, userForWeb } = req.user
    const payload = {
        id: req.params.id,
        sumQuestion: sumQuestion || 12,
        _id,
        isGuest: isGuest || false,
        numberAnswer,
        userForWeb
    }
    topicService
        .makeQuestion(payload)
        .then(response => res.json(response))
        .catch(e => next(e))
}