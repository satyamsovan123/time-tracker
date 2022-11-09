const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  password: { type: String },
  email: { type: String },
  currentData: { type: [ObjectId] },
});

module.exports = mongoose.model("User", userSchema);
