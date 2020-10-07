const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const startSocket = require('./socket');

const port = process.env.PORT || 3000;
const db = process.env.DATABASE_URL || 'mongodb://localhost:27017/unptitfive';

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

routes.routes.forEach((r) => {
    app.use(r.name, r.router);
});

startSocket(io);

server.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
