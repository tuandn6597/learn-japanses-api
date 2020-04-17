const historyService = require('./history.service');

exports.setHistory = (req, res, next) => {
    const { _id } = req.user;
    historyService
        .setHistory(req.body, { _id })
        .then(response => res.json(response))
        .catch(e => next(e))
}