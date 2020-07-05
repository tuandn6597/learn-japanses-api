function randomIntFromInterval(min, max) {
    return ~~(Math.random() * (max - min + 1) + min);
}
const baseURL = process.env.ENV === 'DEV' ? `${process.env.SERVER_URL}:${process.env.PORT}` : `${process.env.SERVER_URL}`
exports.getVideo = () => `${baseURL}/api/assets/videos/video-${randomIntFromInterval(1, 2)}.mp4`

