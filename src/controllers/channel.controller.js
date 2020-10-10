const Channel = require('../models/channel.model');
const utils = require('../utils/utils');

async function getChannels(req, res) {
  const token = req.cookies.auth;
  const user = await utils.getUserByToken(token);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const channels = await Channel.find();

  return res.status(200).json(channels);
}

async function createChannel(req, res) {
  const token = req.cookies.auth;
  const user = await utils.getUserByToken(token);

  if (!user || !user.is_admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!req.body.name) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  const channel = await Channel.findOne({ name: req.body.name });

  if (channel) {
    return res.status(400).json({ message: 'Channel already exists' });
  }

  const newchannel = new Channel({
    name: req.body.name,
  });

  await newchannel.save();

  return res.status(201).json({ message: 'Channel created' });
}

async function deleteChannel(req, res) {
  const token = req.cookies.auth;
  const user = await utils.getUserByToken(token);

  if (!user || !user.is_admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!req.params.id) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  try {
    const result = await Channel.deleteOne({ _id: req.params.id });
    return res.status(200).json({ message: `${result.deletedCount} channel deleted` });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid channel ID' });
  }
}

exports.getChannels = getChannels;
exports.createChannel = createChannel;
exports.deleteChannel = deleteChannel;
