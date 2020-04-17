const Joi = require('joi')
const schemas = {
  createCourse: Joi.object().keys({
    title: Joi.string()
      .empty()
      .required(),
    content: Joi.array()
      .min(1)
      .items(Joi.object())
      .required()
  }),
  setTerms: Joi.object().keys({
    course_id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/, { name: 'objectId' })
      .empty()
      .required(),
    contents: Joi.array()
      .min(1)
      .required(),
    isAdd: Joi.boolean().required()
  }),
  courseId: Joi.object().keys({
    id: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/, { name: 'objectId' })
  }),
  contentId: Joi.object().keys({
    id: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/, { name: 'objectId' })
  })
}
module.exports = schemas
