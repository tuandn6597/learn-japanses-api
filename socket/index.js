const socketIO = require('socket.io');
const userService = require('../components/users/user.service')
const roomService = require('../components/rooms/room.service')
const EVENTS = require('./events');
const config = require('../config')
exports.socket = null;

exports.createServer = ({ server }) => {
    const io = socketIO(server);
    const socketRoom = (room_id) => io.to(room_id);
    io.on(EVENTS.CONNECTION, socket => {
        console.log(`connect -> socketId: ${socket.id}`)
        socket.on(EVENTS.QUIZ_JOIN, (data) => quizJoin({ ...data, socketId: socket.id, socket, socketRoom }))
        socket.on(EVENTS.QUIZ_ANSWER, (data) => quizAnswer({ ...data, socket, socketRoom }))
        socket.on(EVENTS.QUIZ_AUTO_ANSWER, (data) => quizAutoAnswer({ ...data, socket, socketRoom }))
        socket.on(EVENTS.QUIZ_CLOSED, (data) => quizClose({ ...data, socket, socketRoom }))
        socket.on(EVENTS.DISCONNECT, reason => {
            console.log(`disconnect -> socketId: ${socket.id}`)

        })
    })
    return io;
}

const quizJoin = async (data) => {
    const { socket, socketRoom, ...payload } = data

    try {
        console.log('payload:', payload)
        const room = await roomService.join(payload)
        /** new player join */
        const user = room.users.find((user) => (
            (user.userId.toString() === payload.userId) &&
            (user.socketId === socket.id)
        ));
        const roomId = room._id.toString()
        socket.join(roomId);
        socketRoom(roomId).emit(EVENTS.QUIZ_NEW_PLAYER, user);
        socket.emit(EVENTS.QUIZ_JOIN_SUCCESS, room);
        /** */

        await roomService.loadingPlayers({
            room,
            socketRoom
        })
    }
    catch (error) {
        socket.emit(EVENTS.QUIZ_JOIN_ERROR, { message: error.message });
    }

}

const quizAnswer = async ({ roomId, userId, answerAtSecond, questionId, answerId, socket, socketRoom }) => {
    try {
        const index = Math.floor(parseFloat(answerAtSecond))
        console.log('index:', index)
        const room = await roomService.findById(roomId)
        let trueAnswerId = undefined
        for (var i in room.questions) {
            if (room.questions[i]._id == questionId) {
                trueAnswerId = room.questions[i].answer_id
                room.questions[i].user_answers.push({
                    user: userId,
                    answer_id: answerId,
                    answerAtSecond
                })
                break;
            }
        }
        if (trueAnswerId === undefined) {
            throw new Error('questionId not exist in roomId')
        }

        let score = trueAnswerId === answerId ? parseFloat(answerAtSecond) * config.scores[index] : undefined

        for (var i in room.users) {
            if (room.users[i].userId == userId) {
                room.users[i].score = score ? score + room.users[i].score : room.users[i].score;
                break;
            }
        }

        await roomService.findByIdAndUpdate(roomId, { users: room.users, questions: room.questions })

        socketRoom(roomId).emit(EVENTS.QUIZ_ANSWER_RESPONSE, { roomId, userId, score, answerId, answerAtSecond, questionId })
    } catch (error) {
        socket.emit(EVENTS.QUIZ_JOIN_ERROR, { message: `quizAnswer throw ${error.message}` });
    }
}

function randomSecond(min, max) {
    return (Math.random() * (max - min + 1) + min);
}

function randomInt(min, max) {
    return ~~(Math.random() * (max - min + 1) + min)
}

const quizAutoAnswer = async ({ roomId, questionId, socket, socketRoom }) => {
    try {
        const room = await roomService.findById(roomId)

        let trueAnswerId = undefined
        let currentIndexQuestion = undefined

        for (var i in room.questions) {
            if (room.questions[i]._id == questionId) {
                trueAnswerId = room.questions[i].answer_id
                currentIndexQuestion = i
                break;
            }
        }
        if (trueAnswerId === undefined) {
            throw new Error('questionId not exist in roomId')
        }
        const promies = room.users.map(async user => {
            if (!user.isRealUser) {
                const answerAtSecond = randomSecond(0, config.secondToAnswer - 1).toFixed(2)
                setTimeout(async () => {
                    const randomAnswerId = randomInt(0, config.numberOfAnswer - 1)
                    console.log('auto-answer:', {
                        answerAtSecond,
                        randomAnswerId
                    })
                    const index = Math.floor(parseFloat(answerAtSecond))
                    const score = trueAnswerId === randomAnswerId ? parseFloat(answerAtSecond) * config.scores[index] : undefined
                    user.score = score ? score + user.score : user.score;
                    room.questions[currentIndexQuestion].user_answers.push({
                        user: user.userId,
                        answer_id: randomAnswerId,
                        answerAtSecond
                    })
                    await roomService.findByIdAndUpdate(roomId, { users: room.users, questions: room.questions })

                    socketRoom(roomId).emit(EVENTS.QUIZ_ANSWER_RESPONSE, { roomId, userId: user.userId, score: user.score, answerAtSecond, answerId: randomAnswerId, questionId })
                }, answerAtSecond * 1000)
            }
        })
        await Promise.all(promies)

    } catch (error) {
        socket.emit(EVENTS.QUIZ_JOIN_ERROR, { message: `quizAutoAnswer throw ${error.message}` });
    }
}

const quizClose = async ({ roomId, socket, socketRoom }) => {
    try {
        const room = await roomService.findById(roomId)
        let users = room.users
        users.sort(function (a, b) { return b.score - a.score });
        users = users.map((user, i) => {
            return {
                ...user.toJSON(),
                rank: i + 1
            }
        })
        await roomService.findByIdAndUpdate(roomId, { users, status: config.RoomStatus.CLOSE })
        socketRoom(roomId).emit(EVENTS.QUIZ_RANK, { roomId, users })
    } catch (error) {
        socket.emit(EVENTS.QUIZ_JOIN_ERROR, { message: `quizClose throw ${error.message}` });
    }
}

