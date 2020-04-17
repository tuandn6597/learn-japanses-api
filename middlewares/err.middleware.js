const error = require('../helper/err-message')
const errorHandler = (err, req, res, next) => {
  switch (true) {
    case typeof err === 'string':
      return res.status(400).json({ message: err })
    case err.name === 'ValidationError':
      return res.status(400).json({ message: err.message })
    case err.name === 'UnauthorizedError':
      return res.status(401).json({ message: error.invalidToken.message })
    default:
      return res.status(err.status || 500).json({ message: err.message })
  }
}
module.exports = errorHandler;