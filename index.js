const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./config/config.json');
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
app.use(cookieParser(config.COOKIE_SECRET));
app.use(cors({ origin: true, credentials: true }));

// prevent CORS problems
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

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
