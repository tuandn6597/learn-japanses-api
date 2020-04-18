const socketIO = require('socket.io');
const userService = require('../components/users/user.service')
const roomService = require('../components/rooms/room.service')
const EVENTS = require('./events');

exports.socket = null;

exports.createServer = ({ server }) => {
    const io = socketIO(server);
    const socketRoom = (room_id) => io.to(room_id);
    io.on(EVENTS.CONNECTION, socket => {
        console.log(`connect -> socketId: ${socket.id}`)
        try {
            socket.on(EVENTS.QUIZ_JOIN, (data) => quizJoin({ ...data, socketId: socket.id, socket, socketRoom }))
        } catch (e) {

        }
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

        await roomService.startRoom({
            room,
            socketRoom
        })
    }
    catch (error) {
        socket.emit(EVENTS.QUIZ_JOIN_ERROR, { message: error.message });
    }

}
