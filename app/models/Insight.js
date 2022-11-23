const mongoose = require("mongoose");
const Task = require("./Task");
const User = require("./User");
const { ObjectId } = mongoose.Schema.Types;

const insightSchema = new mongoose.Schema({
  email: { type: String, required: true },
  dateAdded: { type: Date, required: true },
  totalTimeLogged: { type: String, required: true },
  timeUsed: { type: String, required: true },
  percentageUsed: { type: String, required: false },
  comment: { type: String, required: false },
});

module.exports = mongoose.model("Insight", insightSchema);
