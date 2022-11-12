const mongoose = require("mongoose");
const Task = require("./Task");
const User = require("./User");
const { ObjectId } = mongoose.Schema.Types;

const userDetailSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("UserDetail", userDetailSchema);
