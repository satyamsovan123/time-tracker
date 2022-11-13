const { Task, User, Insight } = require("../../models");

const {
  BODY_CONSTANT,
  COMMON_CONSTANT,
  DB_OPERATION_CONSTANT,
} = require("../../../constants/constant");

const { handleError, handleSuccess, logger } = require("../../utils");

const getInsight = async (req, res) => {};

const deleteInsight = async (req, res) => {};

module.exports = { deleteInsight, getInsight };
