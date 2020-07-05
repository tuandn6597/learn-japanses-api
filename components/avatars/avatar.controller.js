const { multer, db, error } = require('../../helper')
const upload = multer().single('avatar')
const { Avatar, User } = db
const random_url = (index) => `https://picsum.photos/id/${index}/500/500`

exports.create = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => upload(req, res, err => (err ? reject(err) : resolve())))
    const { buffer, mimetype } = req.file
    const img = {
      data: buffer,
      mime_type: mimetype
    }
    const av = new Avatar(img)
    return res.json(await av.save())
  } catch (error) {
    next(error)
  }
}

exports.set = async (req, res, next) => {
  try {
    const { _id } = req.user
    await new Promise((resolve, reject) => upload(req, res, err => (err ? reject(err) : resolve())))
    if (!req.file) next(error.fileNotFound)
    const { buffer, mimetype } = req.file
    const img = {
      data: buffer,
      mime_type: mimetype
    }
    const av = new Avatar(img)
    const result = await av.save()
    const idAvatar = result._id
    const user = await User.findByIdAndUpdate(_id, { avatar: idAvatar }, { new: true })
    const { hash, avatar, ...userWithoutHash } = user.toJSON()
    res.json({
      ...userWithoutHash,
      avatar: this.getImgUrl(avatar)
    })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const avatar = await Avatar.findById(req.params.id)
    if (!avatar) next(error.avatarNotFound)

    res.writeHead(200, {
      'Content-Type': avatar.mime_type,
      'Content-Length': avatar.data.length
    })
    res.end(avatar.data)
  } catch (err) { 
    next(err)
  }
}

exports.getImgUrl = avatarId => {
  const baseURL = process.env.ENV === 'DEV' ? `${process.env.SERVER_URL}:${process.env.PORT}` : `${process.env.SERVER_URL}`
  return avatarId
    ? `${baseURL}/api/avatars/${avatarId.toString()}`
    : `${random_url(randomIntFromInterval(1, 1000))}`
}

exports.randomAvatarForBot = () => {
  const baseURL = process.env.ENV === 'DEV' ? `${process.env.SERVER_URL}:${process.env.PORT}` : `${process.env.SERVER_URL}`
  const number = randomIntFromInterval(1, 16)
  return `${baseURL}/api/assets/bots/${number}.png`
}

function randomIntFromInterval(min, max) {
  return ~~(Math.random() * (max - min + 1) + min);
}
