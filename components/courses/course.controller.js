const courseService = require('./course.service')
exports.createCourse = (req, res, next) => {
  const { _id } = req.user
  courseService
    .create({ ...req.body, _id })
    .then(response => res.json(response))
    .catch(err => next(err))
}

exports.updateContentOnCourse = (req, res, next) => {
  courseService
    .updateContentOnCourse(req.body)
    .then(response => res.json(response))
    .catch(err => next(err))
}

exports.getCourse = (req, res, next) => {
  courseService
    .findById(req.params && req.params.id || req.query && req.query.id)
    .then(response => res.json(response))
    .catch(err => next(err))
}

exports.deleteCourse = (req, res, next) => {
  const { _id } = req.user
  courseService
    .deleteCourse(req.params && req.params.id || req.query && req.query.id, _id)
    .then(response => res.json({ success: true }))
    .catch(err => next(err))
}

exports.deleteContentCourse = (req, res, next) => {
  courseService
    .deleteContentCourse(req.query.id)
    .then(response => res.json({ success: true }))
}
exports.learn = (req, res, next) => {
  courseService
    .learn(req.params.id)
    .then(response => res.json(response))
    .catch(err => next(err))
}
