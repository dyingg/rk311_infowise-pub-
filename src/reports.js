const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  ip: { type: String, index: true, required: true },
  log: { type: String, index: true, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("reports", ReportSchema);
