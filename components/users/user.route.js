const router = require('express').Router()
const userCtr = require('./user.controller')
const validation = require('../../middlewares/validate.middleware')
const schemas = require('./user.validate')
const { roles } = require('../../helper')

router.post('/', validation(schemas.userPost, 'body'), userCtr.createUser())
router.get('/me', userCtr.authentication(), userCtr.me)
router.post('/login', userCtr.login())
router.post('/login-fb', userCtr.loginFacebook())
router.put('/set-username', [userCtr.authentication(), validation(schemas.setUsername, 'body')], userCtr.setUsername)
router.get('/get-courses-latest', userCtr.authentication(), userCtr.getCourseLatest)
router.put('/set-question', userCtr.authentication(), userCtr.setSumQuestion)
router.put('/invite-friends', userCtr.authentication(), userCtr.inviteFriends)
router.put('/add-friend', userCtr.authentication(), userCtr.addFriend)
//router.post('/admin', validation(schemas.userPost, 'body'), userCtr.createUser(roles.ADMIN))
router.post('/admin/login', [userCtr.authentication(roles.ADMIN), validation(schemas.userLogin, 'body')], userCtr.login(roles.ADMIN))


module.exports = router