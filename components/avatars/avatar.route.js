const router = require('express').Router()
const userCtr = require('../users/user.controller')
const avatarCtr = require('../avatars/avatar.controller')

router.get('/:id', avatarCtr.getById)
router.put('/', userCtr.authentication(), avatarCtr.set)

module.exports = router
