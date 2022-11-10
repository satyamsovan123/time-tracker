const express = require("express");
const router = express.Router();
const { currentTask, addNewTask, updateTask } = require("../controllers/task");
const { validateJWT } = require("../middlewares/JWT");

router.get("/task", currentTask);
router.post("/task", validateJWT, addNewTask);
router.put("/task", validateJWT, updateTask);

module.exports = router;
