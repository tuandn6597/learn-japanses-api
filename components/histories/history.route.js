const router = require('express').Router()
const userCtrl = require('../users/user.controller');
const historyCtrl = require('./history.controller')
router.post('/set-history', userCtrl.authentication(), historyCtrl.setHistory)
module.exports = router;