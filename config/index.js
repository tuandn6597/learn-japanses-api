module.exports = {
    numberOfQuestion: 5,
    numberOfAnswer: 4,
    addBotAfter: 7,
    botAnswerMinDelay: 5,
    botAnswerMaxDelay: 9,
    delayAnimation: 2,
    delayLinkMusics: 5,
    voteThemeIns: 10,
    voteThemeEndDelay: 1,
    keepUserIns: 2.5,
    roomSize: 8,
    RoomStatus: {
        CLOSE: 'CLOSE',
        WAITING: 'WAITING',
        PLAY: 'PLAY'
    },
    factorX: 1, // factor X
    factorX_SD: 1, // factor X of sudden-death
    maxQuestions: 10,
    orderCredits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    score_SD: 1,
    medals: {
        ruby: 2,
        diamond: 5,
        platinum: 10
    },
    timingReloadTicket: 60, // unit is minutes
    timingReloadVideo: 24, // unit is hour
    maxTicket: 5,
    maxVideo: 5,
    maxPrivateRoomSize: 8,
    defaultTheme: 'US',
    lengthIdRoom: 8,
    tag: 'GAME_',
    leng_room_id: 24,
    modeGame: ['title', 'artist'],
    random: {
        modeGame: 'Random',
        numberQuestion: -1,
        theme: { theme_id: '-1', theme_name: 'Random' }
    }

}