const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  currentData: { type: [ObjectId] },
});

module.exports = mongoose.model("User", userSchema);
