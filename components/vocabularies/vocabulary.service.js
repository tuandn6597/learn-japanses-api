const csv = require('csv-parser')
const fs = require('fs')
const { db, error } = require('../../helper')
const { Topic, Vocabulary } = db
const topics = [];

const readLesson = () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream("assets/lesson.csv")
            .pipe(csv())
            .on('data', (data) => {
                const newData = {
                    title: data.lesson_title,
                    lesson_number: data.lesson_number
                }
                topics.push(newData);
            })
            .on('end', () => {
                resolve(topics)
            });
    })
}

exports.createByCsv = async () => {
    await Promise.all([Topic.deleteMany(), Vocabulary.deleteMany()])
    const topics = await readLesson();
    await Topic.insertMany(topics)
    const get_topics = await Topic.find().lean();

    fs.createReadStream("assets/vocabulary.csv")
        .pipe(csv())
        .on('data', async (data) => {
            const topic = get_topics.find(topic => topic.lesson_number === data.lesson_id);
            const id_topic = topic._id;
            const { vocabulary_text, kanji_meaning, vocabulary_meaning, vocabulary_sound, kanji_text } = data;
            if (vocabulary_text && kanji_meaning && vocabulary_meaning && vocabulary_sound && kanji_text) {
                const newData = {
                    text: vocabulary_text,
                    mean: kanji_meaning,
                    meaning: vocabulary_meaning,
                    sound: vocabulary_sound,
                    kanji_text
                }
                const vocab = await Vocabulary.create(newData);
                await Topic.findByIdAndUpdate(id_topic, { $push: { vocabularies: vocab } })
            }
        })
        .on('end', () => {

        });

};