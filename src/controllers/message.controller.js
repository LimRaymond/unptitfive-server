const Message = require('../models/message.model');

async function getMessages(req, res) {
  if (!req.params.channel_id) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  try {
    const messages = await Message.find({ channel: req.params.channel_id });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid channel ID' });
  }
}

async function createMessage(req, res) {
  if (!req.body.message || !req.body.channel_id) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  try {
    const newmessage = new Message({
      message: req.body.message,
      user: req.user._id,
      channel: req.body.channel_id,
    });

    await newmessage.save();

    return res.status(201).json({ message: 'Message created' });
  } catch (error) {
    return res.status(400).json({ message: 'Error' });
  }
}

async function deleteMessage(req, res) {
  if (!req.params.id) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  try {
    const result = await Message.deleteOne({ _id: req.params.id });
    return res.status(200).json({ message: `${result.deletedCount} message deleted` });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid message ID' });
  }
}

exports.getMessages = getMessages;
exports.createMessage = createMessage;
exports.deleteMessage = deleteMessage;
