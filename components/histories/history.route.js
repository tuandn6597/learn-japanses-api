const router = require('express').Router()
const userCtrl = require('../users/user.controller');
const historyCtrl = require('./history.controller')
router.post('/set-history', userCtrl.authentication(), historyCtrl.setHistory)
router.get('/tracking/:topicId', userCtrl.authentication(), historyCtrl.tracking)
module.exports = router;