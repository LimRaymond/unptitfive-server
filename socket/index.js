const ent = require('ent');
const Channel = require('../models/channel.model');
const Message = require('../models/message.model');
const utils = require('../utils/utils');

function startSocket(io) {
    io.use(async (socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            const user = await utils.getUserByToken(socket.handshake.query.token);
            if (!user) return next(new Error('Authentication error'));
            socket.user = user;
            socket.channel = null;
            return next();
        }
        return next(new Error('Authentication error'));
    });

    io.sockets.on('connection', (socket) => {
        console.log(`New connection (${socket.user._id})`);

        socket.on('join', async (channelName) => {
            const channel = await Channel.findOne({ name: channelName });
            if (channel) {
                // Leave the old channel
                if (socket.channel) {
                    socket.leave(socket.channel.name, () => {
                        io.in(socket.channel.name).emit('info', {
                            message: `${socket.user.username} has left the channel`,
                            color: 'teal',
                        });
                    });
                }

                // Send old channel messages to the newcomer
                const messages = await Message.find({ channel: channel._id }).populate('user', 'username');
                const oldMessages = [];
                messages.forEach((m) => {
                    oldMessages.push({
                        username: m.user.username,
                        message: m.message,
                        date: utils.convertDate(m.date),
                    });
                });
                socket.emit('message', oldMessages);

                // Join the new channel
                socket.channel = channel;
                socket.join(channel.name, () => {
                    io.in(socket.channel.name).emit('info', {
                        message: `${socket.user.username} has joined the channel`,
                        color: 'teal',
                    });
                });
            }
        });

        socket.on('message', async (message) => {
            if (socket.channel) {
                // Encode message
                message = ent.encode(message);

                // Save message in database
                const newmessage = new Message({
                    message,
                    user: socket.user._id,
                    channel: socket.channel._id,
                });
                const res = await newmessage.save();

                // Broadcast message
                io.in(socket.channel.name).emit('message', [{
                    username: socket.user.username,
                    message,
                    date: utils.convertDate(res.date),
                }]);
            }
        });

        socket.on('disconnect', () => {
            if (socket.channel) {
                io.in(socket.channel.name).emit('info', {
                    message: `${socket.user.username} has left the channel`,
                    color: 'teal',
                });
            }
        });
    });
}

module.exports = startSocket;
