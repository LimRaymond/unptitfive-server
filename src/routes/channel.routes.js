const router = require('express').Router();
const controller = require('../controllers/channel.controller');

router.get('/', controller.getChannels);
router.post('/', controller.createChannel);
router.delete('/:id', controller.deleteChannel);

module.exports = router;
