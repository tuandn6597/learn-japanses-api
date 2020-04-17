function randomIntFromInterval(min, max) {
    return ~~(Math.random() * (max - min + 1) + min);
}
exports.getVideo = () => `${process.env.SERVER_URL}:${process.env.PORT}/api/assets/videos/video-${randomIntFromInterval(1, 2)}.mp4`

