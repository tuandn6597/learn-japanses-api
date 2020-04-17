const router = require('express').Router()
const topicCtrl = require('./topic.controller')
const userCtrl = require('../users/user.controller')

// router.post('/', topicCtrl.createTopic)
router.get('/:id', userCtrl.authentication(), topicCtrl.getDetails)
router.get('/', userCtrl.authentication(), topicCtrl.getAll)
router.get('/:id/learn', userCtrl.authentication(), topicCtrl.leanTopic)
module.exports = router