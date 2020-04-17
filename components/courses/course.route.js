const router = require('express').Router()
const userCtrl = require('../users/user.controller')
const courseCtrl = require('../courses/course.controller')
const validation = require('../../middlewares/validate.middleware')
const schemas = require('./course.validate')

router.post('/', [userCtrl.authentication(), validation(schemas.createCourse, 'body')], courseCtrl.createCourse)
router.put(
  '/set-contents',
  [userCtrl.authentication(), validation(schemas.setTerms, 'body')],
  courseCtrl.updateContentOnCourse
)
//oggy
router.get('/', [userCtrl.authentication(), validation(schemas.courseId, 'query')], courseCtrl.getCourse);
router.delete('/', [userCtrl.authentication(), validation(schemas.courseId, 'query')], courseCtrl.deleteCourse);
router.delete('/content', [userCtrl.authentication, validation(schemas.contentId, 'query')], courseCtrl.deleteContentCourse);
//
router.get('/:id', [userCtrl.authentication(), validation(schemas.courseId, 'params')], courseCtrl.getCourse);
router.delete('/:id', [userCtrl.authentication(), validation(schemas.courseId, 'params')], courseCtrl.deleteCourse);


router.get('/:id/learn', [userCtrl.authentication(), validation(schemas.courseId, 'params')], courseCtrl.learn)
module.exports = router
