const Channel = require('../models/channel.model');

async function getChannels(req, res) {
  const channels = await Channel.find();

  return res.status(200).json(channels);
}

exports.getChannels = getChannels;
