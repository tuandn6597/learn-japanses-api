const router = require('express').Router()
const alphabetCtrl = require('../alphabet/alphabet.controller')
const userCtrl = require('../users/user.controller')
router.get('/:type', userCtrl.authentication() , alphabetCtrl.getByType)
module.exports = router