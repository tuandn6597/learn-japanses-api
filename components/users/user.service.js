const { db, error } = require('../../helper')
const { User } = db
const salt = 10
const bcrypt = require('bcryptjs')
const IO = require('../../socket');
const EVENTS = require('../../socket/events')

exports.findById = id => User.findById(id)
exports.findOne = async user => User.findOne(user).lean()
exports.findByIdAndUpdate = ({ _id, ...data }) => User.findByIdAndUpdate(_id, data, { new: true })

exports.getMe = id => this.findById(id).select('-hash')

exports.create = async postBody => {
  const { password, username, ...info } = postBody
  const name = username.toLowerCase().replace(/\s/g, '')
  const [userExisted, hashPass] = await Promise.all([this.findOne({ username: name }), bcrypt.hash(password, salt)])
  if (userExisted) throw error.userExisted
  const user = await User.create({
    username: name,
    hash: hashPass,
    ...info
  })
  const { hash, ...userWithoutHash } = user.toJSON()
  return userWithoutHash
}

exports.setUsername = async ({ username, newName, password, _id }) => {
  const [userExisted, user] = await Promise.all([this.findOne({ username: newName }), this.findOne({ username })])
  if (user && bcrypt.compareSync(password, user.hash)) {
    if (userExisted) throw error.userExisted
    const updateUser = await this.findByIdAndUpdate({ _id, username: newName }).select('-hash')
    return updateUser.toJSON()
  } else throw error.wrongPass
}

exports.login = async ({ username, password, email }) => {
  const user = await this.findOne({ ...(email ? { email } : { username }) })
  if (user && bcrypt.compareSync(password, user.hash)) {
    const u_user = await this.findByIdAndUpdate({ _id: user._id, isGuest: false, ...(email ? { typeLogin: User.type_login.EM } : { typeLogin: User.type_login.UN }) })
    const { hash, ...userWithoutHash } = u_user.toJSON()
    return userWithoutHash
  } else throw error.loginFailed
}

exports.getCourseLatest = async id => {
  const user = await User.findById(id)
    .populate({ path: 'courses', populate: { path: 'contents' }, options: { sort: '-create_at' } })
    .select('-hash')
  const { avatar, username, _id, courses, create_at, ...userExceptField } = user.toJSON()
  return {
    avatar,
    username,
    _id,
    courses,
    create_at
  }
}

exports.setSumQuestion = (body, _id) => {
  return this.findByIdAndUpdate({ _id, ...body })
}

exports.inviteFriends = async (body, user) => {
  const { friend_id } = body;
  const { isOnline, socketId } = await User.findById(friend_id)
  IO.socket && isOnline && socketId && IO.socket.to(socketId).emit(EVENTS.INVITE_FRIEND, { invite_from: user })
  return { success: true }
}

exports.addFriend = (body, _id) => {
  const { friend_id } = body;
  return this.findByIdAndUpdate({ _id, friends: friend_id })
}

exports.facebookLogin = async (body) => {
  const { email, name, token, id, picture } = body;
  // login by facebookLogin
  if (id) {
    const userExisted = await User.findOne({ fbId: id })
      .select({ hash: 0 })
      .lean()
      .exec();

    if (userExisted)
      return userExisted
  }

  // create new user loginByFB

  const user = await User.create({
    email,
    username: name,
    typeLogin: User.type_login.FB,
    hash: 'no-hash',
    isGuest: false,
    fbId: id,
    avatar: picture
  })

  const { hash, ...userWithoutHash } = user.toJSON()
  return userWithoutHash

};


