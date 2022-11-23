const mongoose = require("mongoose");
const Task = require("./Task");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  currentTask: [{ type: ObjectId, ref: "Task" }],
});

module.exports = mongoose.model("User", userSchema);
