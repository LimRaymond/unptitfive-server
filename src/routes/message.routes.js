const router = require('express').Router();
const controller = require('../controllers/message.controller');
const auth = require('../middlewares/auth');

router.get('/:channel_id', auth, controller.getMessages);
router.post('/', auth, controller.createMessage);
router.delete('/:id', auth, controller.deleteMessage);

module.exports = router;
