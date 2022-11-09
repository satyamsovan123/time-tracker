const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const taskSchema = new mongoose.Schema({
  startTime: { type: Date },
  endTime: { type: Date },
  timeUsed: { type: String },
  dateAdded: { type: Date },
});

module.exports = mongoose.model("Task", taskSchema);
