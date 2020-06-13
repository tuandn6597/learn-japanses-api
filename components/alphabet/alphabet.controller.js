const alphabetService = require('./alphabet.service')
exports.getByType = (req, res, next) => {
    const { type } = req.params
    alphabetService
        .getByType(type)
        .then(response => res.json(response))
        .catch(err => next(err))
}
