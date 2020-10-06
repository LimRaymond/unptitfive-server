const router = require('express').Router();
const controller = require('../controllers/message.controller');

router.get('/:channel_id', controller.getMessages);
router.post('/', controller.createMessage);

module.exports = router;
