const router = require('express').Router();
const controller = require('../controllers/user.controller');
const auth = require('../middlewares/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', auth, controller.logout);
router.get('/profile', auth, controller.profile);
router.post('/profile/edit', auth, controller.editProfile);

module.exports = router;
