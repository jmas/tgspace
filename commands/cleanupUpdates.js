const { cleanupUpdates: _cleanupUpdates } = require("../utils/queries");

const cleanupUpdates = async () => {
  return await _cleanupUpdates();
};

module.exports = cleanupUpdates;
