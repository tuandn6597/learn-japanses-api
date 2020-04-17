const vocabService = require('./vocabulary.service')

exports.readVocabulary = async (req, res, next) => {
    try {
        await vocabService.createByCsv()
        res.json({ success: true })
    }
    catch (err) {
        next(err)
    }
}