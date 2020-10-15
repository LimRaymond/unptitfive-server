const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./src/routes');
const startSocket = require('./src/socket');
const { translate } = require('./src/utils/utils');

const port = process.env.PORT || 3000;
const db = process.env.DATABASE_URL || 'mongodb://localhost:27017/unptitfive';

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (['http://localhost', 'https://unptitfive-front.herokuapp.com'].indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

routes.routes.forEach((r) => {
  app.use(r.name, r.router);
});

// Handle Error 404
app.use((req, res) => {
  const lang = req.acceptsLanguages();
  res.status(404).json({ message: translate('ERROR_404', lang) });
});

startSocket(io);

server.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
