const ent = require('ent');
const utils = require('../utils/utils');

function startSocket(io) {
    io.use(async (socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            const user = await utils.getUserByToken(socket.handshake.query.token);
            if (!user) return next(new Error('Authentication error'));
            socket.user = user;
            return next();
        }
        return next(new Error('Authentication error'));
    });

    io.sockets.on('connection', (socket) => {
        console.log(`New connection (${socket.user._id})`);

        socket.on('message', async (data) => {
            // Check if user is connected
            const user = await utils.getUserByToken(socket.user.token);
            if (!user) return;
            const message = ent.encode(data.message);
            socket.broadcast.emit('message', {
                message,
            });
        });
    });
}

module.exports = startSocket;
