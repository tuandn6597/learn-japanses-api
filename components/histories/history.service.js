const { db } = require('../../helper')
const { History, Topic } = db

exports.getById = (id) => History.findById(id)

//todo
exports.setHistory = async (body, userId) => {
    const { topicId, answers } = body;
    const condition = {
        topic: topicId,
        user: userId
    }
    const [history, topic] = await Promise.all([
        History.findOne(condition),
        Topic.findById(topicId)
    ])
    if (history) {
        const promises = topic.vocabularies.map(vocabulary => {
            const userAnswer = answers.find(item => item.question === vocabulary.toString())
            if (userAnswer) {
                if (userAnswer.correct) {
                    return History.findByIdAndUpdate(history._id, {
                        $addToSet: {
                            correctAnswers: vocabulary
                        },
                        $pull: {
                            notAnswers: vocabulary,
                            incorrectAnswers: vocabulary
                        }
                    }, { new: true })
                }
                return History.findByIdAndUpdate(history._id, { $addToSet: { incorrectAnswers: vocabulary } }, { new: true })
            }
            return History.findByIdAndUpdate(history._id, { $addToSet: { notAnswers: vocabulary } }, { new: true })
        })

        await Promise.all(promises)
        return History.findById(history._id)
    }
    let correctAnswers = []
    let incorrectAnswers = []
    let notAnswers = []
    topic.vocabularies.forEach(vocabulary => {
        const userAnswer = answers.find(item => item.question === vocabulary.toString())
        if (userAnswer) {
            if (userAnswer.correct) {
                correctAnswers.push(vocabulary)
                return;
            }
            incorrectAnswers.push(vocabulary)
            notAnswers.push(vocabulary)
            return;
        }
        notAnswers.push(vocabulary)
        return;
    });
    const createdHistory = await History.create({ ...condition, correctAnswers, incorrectAnswers, notAnswers });
    return createdHistory
}