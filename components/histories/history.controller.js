const historyService = require('./history.service');

exports.setHistory = (req, res, next) => {
    historyService
        .setHistory(req.body, req.user._id)
        .then(response => res.json(response))
        .catch(e => next(e))
}
exports.tracking = (req, res, next) => {
    if (!req.params.topicId) {
        throw new Error('require topicId')
    }
    console.log({
        topicId: req.params.topicId,
        userId: req.user._id
    })
    historyService
        .tracking(req.params.topicId, req.user._id)
        .then(response => res.json(response))
        .catch(e => next(e))
}