const jwt = require('jsonwebtoken')
const { error } = require('../../helper')
const avatarCtr = require('../avatars/avatar.controller')
const userService = require('./user.service')

const typeToken = {
  accessToken: 'access',
  refreshToken: 'refresh'
}

const _createToken = (user, role = '') => {
  const payload = {
    email: user.email,
    _id: user._id.toString(),
    type: typeToken.accessToken,
    role
  }
  return {
    token: jwt.sign(payload, !role ? process.env.TOKEN_SECRET : process.env.TOKEN_ADMIN_SECRET, {
      expiresIn: !role ? process.env.TOKEN_EXPIRED : process.env.TOKEN_ADMIN_EXPIRED
    })
  }
}

exports.authentication = (role = '') => (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]
    return jwt.verify(token, !role ? process.env.TOKEN_SECRET : process.env.TOKEN_ADMIN_SECRET, async (err, decoded) => {
      if (err) return next({ status: 401, message: err.message })
      const user = await userService.findById(decoded._id).select('-hash')
      if (!user) next(error.invalidToken)
      req.user = user
      next()
    })
  } else next(error.tokenRequire)
}

exports.createUser = (role = '') => (req, res, next) => {
  userService
    .create(req.body)
    .then(response =>
      res.json({
        ...response,
        avatar: avatarCtr.getImgUrl(response.avatar),
        token: _createToken(response, role).token
      })
    )
    .catch(err => next(err))
}

exports.login = (role = '') => (req, res, next) => {
  userService
    .login(req.body)
    .then(response =>
      res.json({
        ...response,
        avatar: avatarCtr.getImgUrl(response.avatar),
        isGuest: false,
        ...(!role && { token: _createToken(response, role).token })
      })
    )
    .catch(err => next(err))
}

exports.loginFacebook = (role = '') => (req, res, next) => {
  userService
    .facebookLogin(req.body)
    .then(response =>
      res.json({
        ...response,
        isGuest: false,
        ...(!role && { token: _createToken(response, role).token })
      })
    )
    .catch(err => next(err))
}

exports.me = (req, res, next) => {
  const { _id } = req.user
  userService
    .getMe(_id)
    .then(response =>
      res.json({
        ...response.toJSON(),
        avatar: avatarCtr.getImgUrl(response.toJSON().avatar)
      })
    )
    .catch(err => next(err))
}

exports.setUsername = (req, res, next) => {
  const { password, newName } = req.body
  const { username, _id } = req.user
  userService
    .setUsername({ password, username, _id, newName })
    .then(response =>
      res.json({
        ...response,
        avatar: avatarCtr.getImgUrl(response.avatar)
      })
    )
    .catch(err => next(err))
}

exports.getCourseLatest = (req, res, next) => {
  userService
    .getCourseLatest(req.user._id)
    .then(response =>
      res.json({
        ...response,
        avatar: avatarCtr.getImgUrl(response.avatar)
      })
    )
    .catch(err => next(err))
}

exports.setSumQuestion = (req, res, next) => {
  const { _id } = req.user;
  userService
    .setSumQuestion(req.body, _id)
    .then(response => res.json({ success: true, newSum: response.sumQuestion, newNumberAnswer: response.numberAnswer }))
    .catch(e => next(e))
}

exports.inviteFriends = (req, res, next) => {
  userService
    .inviteFriends(req.body, req.user)
    .then(response => res.json(response))
    .catch(e => next(e))
}

exports.addFriend = (req, res, next) => {
  const { _id } = req.user;
  userService
    .inviteFriends(req.body, _id)
    .then(response => res.json({ success: true }))
    .catch(e => next(e))
}
