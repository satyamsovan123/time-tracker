const express = require("express");
const router = express.Router();
const { currentTask, updateTask } = require("../controllers/task");

router.get("/task", currentTask);
router.put("/task", updateTask);

module.exports = router;
