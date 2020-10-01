const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User.model');

const app = express();
const port = process.env.PORT || 3000;
const connection = process.env.DATABASE_URL || 'mongodb://localhost:27017/unptitfive';

mongoose.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.get('/user-create', async (req, res) => {
    const user = new User({ username: 'John' });
    await user.save().then(() => {
        console.log('User created');
    });
    res.send('User created');
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
