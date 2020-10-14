const Message = require('../models/message.model');
const { translate } = require('../utils/utils');

async function getMessages(req, res) {
  if (req.params.channel_id) {
    try {
      const messages = await Message.find({ channel: req.params.channel_id });
      return res.status(200).json(messages);
    } catch (error) {
      const lang = req.acceptsLanguages();
      return res.status(400).json({ message: translate('ERROR_STRING_INVALID', lang, 'channel_id') });
    }
  } else {
    const messages = await Message.find();
    return res.status(200).json(messages);
  }
}

exports.getMessages = getMessages;
