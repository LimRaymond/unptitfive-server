const Message = require('../models/message.model');

async function getMessages(req, res) {
  if (req.params.channel_id) {
    try {
      const messages = await Message.find({ channel: req.params.channel_id });
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid channel ID' });
    }
  } else {
    const messages = await Message.find();
    return res.status(200).json(messages);
  }
}

exports.getMessages = getMessages;
