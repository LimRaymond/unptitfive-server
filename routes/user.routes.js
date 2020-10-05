const router = require('express').Router();
const controller = require('../controllers/user.controller');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.get('/profile', controller.profile);
router.post('/profile/edit', controller.editProfile);

module.exports = router;
