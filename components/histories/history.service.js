const { db } = require('../../helper')
const { History, User } = db
const topicService = require('../topics/topic.service');
const userService = require('../users/user.service');

exports.getById = (id) => History.findById(id)


//todo
exports.setHistory = async (body, { _id }) => {

    const { histories } = await User.findById(_id).populate({ path: 'histories', populate: { path: 'topic' } })
    const history = histories.find(history => history.topic._id.toString() === body.topic)
    if (history) {
        const finish_question = (body.answers.map(item => item.correct)).length
        const pass_topic = (finish_question + history.finish_question) === history.topic.vocabularies.length

        const [u_history, u_user] = await Promise.all([
            History.findByIdAndUpdate(history._id, { ...body, finish_question }, { new: true }),
            !pass_topic ? Promise.resolve() : userService.findByIdAndUpdate({ _id, $inc: { lession_number: 1 } })
        ])
        return u_history
    }
    const create_history = await History.create(body);
    await userService.findByIdAndUpdate({ _id, histories: create_history._id })
    return create_history;

}