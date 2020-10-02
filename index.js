const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;
const connection = process.env.DATABASE_URL || 'mongodb://localhost:27017/unptitfive';

mongoose.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

routes.routes.forEach((r) => {
    app.use(r.name, r.router);
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
