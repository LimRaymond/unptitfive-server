const User = require('../models/User.model');

async function getUsers(req, res) {
    const users = await User.find();
    res.json(users);
}

async function createUser(req, res) {
    const user = new User({ username: 'John' });
    await user.save().then(() => {
        console.log('User created');
    });
    res.send('User created');
}

exports.createUser = createUser;
exports.getUsers = getUsers;
