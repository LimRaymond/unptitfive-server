const utils = require('../utils/utils');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.auth;
    const user = await utils.getUserByToken(token);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(400).json({ message: 'Authentication error' });
  }
};
