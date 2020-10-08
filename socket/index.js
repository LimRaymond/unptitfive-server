const ent = require('ent');
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

        socket.on('join', (channel) => {
            if (socket.channel) {
                socket.leave(socket.channel, () => {
                    io.in(socket.channel).emit('data', {
                        message: `<b style="color: teal;">${socket.user.username} has left the channel</b>`,
                    });
                });
            }
            socket.channel = channel;
            socket.join(channel, () => {
                io.in(channel).emit('data', {
                    message: `<b style="color: teal;">${socket.user.username} has joined the channel</b>`,
                });
            });
        });

        socket.on('message', (message) => {
            if (socket.channel) {
                message = ent.encode(message);
                io.in(socket.channel).emit('data', {
                    message: `<b>${socket.user.username}</b> : ${message}`,
                });
            }
        });

        socket.on('disconnect', () => {
            if (socket.channel) {
                io.in(socket.channel).emit('data', {
                    message: `<b style="color: teal;">${socket.user.username} has left the channel</b>`,
                });
            }
        });
    });
}

module.exports = startSocket;
