const utils = require('../utils/utils');
const { translate } = require('../utils/utils');

module.exports = async (req, res, next) => {
  const lang = req.acceptsLanguages();
  try {
    const token = req.cookies.auth;
    const user = await utils.getUserByToken(token);

    if (!user) {
      return res.status(401).json({ message: translate('ERROR_UNAUTHORIZED', lang) });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(400).json({ message: translate('ERROR_AUTHENTICATION', lang) });
  }
};
