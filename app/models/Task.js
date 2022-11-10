const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const taskSchema = new mongoose.Schema({
  email: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  timeUsed: { type: String, required: true },
  dateAdded: { type: Date, required: true },
});

module.exports = mongoose.model("Task", taskSchema);
