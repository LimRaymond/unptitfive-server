const router = require('express').Router();
const controller = require('../controllers/channel.controller');
const auth = require('../middlewares/auth');

router.get('/', auth, controller.getChannels);

module.exports = router;
