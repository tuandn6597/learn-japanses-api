const { db, error } = require('../../helper')
const question = require('../../helper/question')
const { Topic, User, RoomConfig, Room } = db
const topicService = require('../topics/topic.service')
const avatarController = require('../avatars/avatar.controller')
const config = require('../../config')
const _rooms = new Map();
const { Types } = require('mongoose');
const { RoomStatus } = require('../../config')
const EVENTS = require('../../socket/events')

function randomCharacter(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


exports.join = async ({ userId, socketId, topicId }) => {
    try {
        const usersOnRoom = {
            userId,
            socketId
        };
        const room_config = await RoomConfig.findOne({});
        const roomSize = room_config ? room_config.roomSize : config.roomSize
        const room = await _randomRoom({ topicId, roomSize })
        /** create new room */
        if (!room) {
            const [topic, user] = await Promise.all([
                !topicId ?
                    topicService.randomTopic().then(topic => topic._id.toString()) : Promise.resolve(topicId),
                User.findById(userId)
            ])

            usersOnRoom['avatar'] = avatarController.getImgUrl(user.avatar)
            usersOnRoom['rank'] = 1;
            usersOnRoom['username'] = user.username;

            const new_room = await Room.create({
                sizeRoom: roomSize,
                topic: topicId,
                status: RoomStatus.WAITING,
                users: [usersOnRoom],
            })

            const room_id = new_room._id;
            _rooms.set(room_id.toString(), {
                dicUsers: {
                    [userId]: usersOnRoom
                },
                roomSize
            })
            return new_room
        }
        /** end create new room */

        /** join room existed */
        const rank = room.users.length + 1
        return User.findById(userId)
            .then((user) => {
                usersOnRoom['avatar'] = avatarController.getImgUrl(user.avatar);
                usersOnRoom['username'] = user.username;
                usersOnRoom['rank'] = rank;
                _rooms.get(room._id.toString()).dicUsers[user._id.toString()] = usersOnRoom
                return Room.findByIdAndUpdate(room._id, {
                    $push: {
                        users: usersOnRoom
                    }
                }, { new: true });
            })
    } catch (error) {
        throw new Error(`exports.join ${error.message}`)
    }
}
const _randomRoom = ({
    topicId,
    roomSize,
}) => {
    const conditions = {
        ...topicId ? { topic: topicId } : {},
        status: RoomStatus.WAITING,
        _id: {
            $in: Array.from(_rooms.keys())
        },
        ["users." + (roomSize - 1)]: { $exists: false }
    };
    return Room.countDocuments(conditions).then((count) => {
        return Room.findOne(conditions).skip(
            Math.floor(Math.random() * count)
        );
    });
};



const _addBots = async (room_id, timeAdd = 0) => {
    const room = await Room.findById(room_id);
    if (room.users.length < room.sizeRoom) {
        const numberUser = room.users.length
        const numberBot = room.sizeRoom - numberUser

        const promises = Array(numberBot).fill().map(async (bot, index) => {
            const rank = numberUser + index + 1
            const userBot = {
                rank,
                isRealUser: false,
                userId: Types.ObjectId(),
                avatar: avatarController.randomAvatarForBot(),
                username: 'Bot_' + randomCharacter(4)
            }
            _rooms.get(room_id).dicUsers[userBot.userId] = userBot;
            _rooms.get(room_id).broadcast(EVENTS.QUIZ_NEW_PLAYER, userBot);
            return Room.findByIdAndUpdate(room_id, {
                $push: {
                    users: userBot
                }
            })
        })

        await Promise.all(promises)
    }
};

const _startRoom = async ({
    room,
    socketRoom,
    EVENTS
}) => {
    const room_id = room._id.toString();
    try {
        /**  */
        _rooms.get(room_id).broadcast = (eventName, eventData) => {
            socketRoom(room_id).emit(eventName, eventData);
        }

        setTimeout(async () => {
            await Room.findByIdAndUpdate(room_id, { status: RoomStatus.PLAY });
            await _addBots(room_id);
        }, config.addBotAfter * 1000);



    } catch (error) {
        console.log(`_startRoom ${error.message}`)
    }
};

exports.startRoom = _startRoom;