const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlackListSchema = new Schema({
  ip: { type: String, required: true, index: true },
  blacklist: { type: String, required: true },
  cbip: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("blacklist", BlackListSchema);
