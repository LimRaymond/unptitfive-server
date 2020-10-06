const router = require('express').Router();
const controller = require('../controllers/message.controller');

router.get('/:channel_id', controller.getMessages);
router.post('/', controller.createMessage);
router.delete('/:id', controller.deleteMessage);

module.exports = router;
