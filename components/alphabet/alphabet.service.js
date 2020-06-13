const { Alplabet } = require('../../helper/db')

exports.getByType = async (alplabetType) => {
    return Alplabet.find({ alplabetType })
}