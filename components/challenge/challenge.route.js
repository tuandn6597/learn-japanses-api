const router = require('express').Router()
const challengeCtr = require('./challenge.controller')

router.get('/', challengeCtr.getAll)
router.get('/:id', challengeCtr.getById)
// router.post('/importDB', challengeCtr.importDB)

module.exports = router;