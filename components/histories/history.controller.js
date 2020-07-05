const historyService = require('./history.service');

exports.setHistory = (req, res, next) => {
    historyService
        .setHistory(req.body, req.user._id)
        .then(response => res.json(response))
        .catch(e => next(e))
}