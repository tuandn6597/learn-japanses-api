const router = require('express').Router()
const vocabCtrl = require('./vocabulary.controller')
//api để insert data (ko được test)
router.post('/read-csv', vocabCtrl.readVocabulary)

module.exports = router