const { db, error } = require('../../helper')
const question = require('../../helper/question')
const { Course, Content, User } = db

exports.makeQuestion = async id => {
  const courses = await this.findById(id)
  if (!courses)
    throw error.courseNotFound
  return question._makeQuestion({}, courses.contents)
}

exports.learn = id => this.makeQuestion(id);

exports.findById = id => {
  return Course.findById({ _id: id }).populate('contents');
}

exports.addContent = async (id, content) => {
  const contents = await Content.create(content)
  return Course.findByIdAndUpdate(id, { $push: { contents } }, { new: true })
}

exports.removeContent = (id, contents) => {
  return Promise.all([
    Course.findByIdAndUpdate(id, { $pull: { contents: { $in: contents } } }),
    Content.deleteMany({ _id: { $in: contents } })
  ])
}

exports.updateContentOnCourse = body => {
  const { course_id, contents, isAdd } = body
  return isAdd ? this.addContent(course_id, contents) : this.removeContent(course_id, contents)
}

exports.create = async body => {
  const { title, content, _id } = body
  const contents = await Content.create(content)
  const courses = await Course.create({ title, contents })
  await User.findByIdAndUpdate(_id, { $push: { courses } })
  return courses
}

exports.deleteCourse = async (id_course, id_user) => {
  const course = await Course.findById({ _id: id_course });
  return Promise.all([
    Content.deleteMany({ _id: { $in: course.contents } }),
    Course.deleteOne({ _id: id_course }),
    User.findByIdAndUpdate({ _id: id_user }, { $pull: { courses: id_course } })
  ])
}

exports.deleteContentCourse = async (id_content) => {
  return Promise.all([
    Content.findByIdAndDelete({ _id: id_content }),
    Course.findOneAndUpdate({ contents: id_content }, { $pull: { contents: id_content } }),
  ])
}
