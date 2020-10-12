const Channel = require('../models/channel.model');

async function getChannels(req, res) {
  const channels = await Channel.find();

  return res.status(200).json(channels);
}

async function createChannel(req, res) {
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
