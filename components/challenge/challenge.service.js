const { db, error } = require('../../helper')
const { Challenge } = db
const data = require('../../assets/challenge.json')

exports.getAll = async () => {
    const query = Challenge.find({})
    query.select('question level')
    return query.exec();
};
exports.getById = id => Challenge.findById(id);
// exports.importData = async () => {
//     await Promise.all(Challenge.deleteMany())
//     await Challenge.insertMany(data)
// }