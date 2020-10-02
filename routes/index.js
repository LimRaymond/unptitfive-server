const user = require('./user.routes');

exports.routes = [
    { name: '/user', router: user },
];
