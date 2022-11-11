const Task = require("../../models/Task");
const _ = require("lodash");

const {
  commonConstant,
  dbOperationsConstant,
  bodyConstant,
} = require("../../../constants/constant");

const { logger } = require("../../utils/logger");
const { handleError, handleSuccess, validateEmail } = require("../../utils");
const User = require("../../models/User");

/**
 * This method returns the task details for the provided task ObjectIds
 *
 * @requires {@link handleError}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {[ObjectId]} taskIdList is the array of ObjectId of the tasks
 * @returns {{message: string, status: boolean}} success response with data or error response object based on various criterias
 */
const currentTask = async (req, res) => {
  /**
   * @type {boolean}
   */
  let isTaskListFetched = false;
  /**
   * @type {[{}]}
   */
  let taskList = [];
  /**
   * @type {{statusCode: number, message: string}}
   */
  let response = {
    stausCode: 500,
    message: commonConstant.GENERIC_ERROR_MESSAGE,
  };
  try {
    /**
     * @type {string}
     * @const
     */
    const email = req.body[bodyConstant.EMAIL];
    const userEmailInHeader =
      req[bodyConstant.CURRENT_USER][bodyConstant.EMAIL];

    /**
     * @type {boolean}
     * @const
     */
    const isValidEmail = validateEmail(email);

    if (!isValidEmail || email !== userEmailInHeader) {
      response = {
        statusCode: 400,
        message: `${
          bodyConstant.EMAIL.charAt(0).toUpperCase() +
          bodyConstant.EMAIL.slice(1)
        }${commonConstant.INVALID_FIELD}`,
        status: isTaskListFetched,
      };
      return handleError(response, res);
    }

    taskList = await Task.find({ email: userEmailInHeader }).select(
      "-_id -email -__v -dateAdded"
    );
    console.log(taskList);
    if (taskList) {
      isTaskListFetched = true;
      response = {
        data: taskList,
        statusCode: 200,
        message: `${dbOperationsConstant.DATA_RETRIEVED}`,
        status: isTaskListFetched,
      };
      return handleSuccess(response, res);
    }

    return taskList;
  } catch (error) {
    logger(error);
    response = {
      statusCode: 500,
      message: `${commonConstant.GENERIC_ERROR_MESSAGE}`,
      status: isTaskListFetched,
    };
    return handleError(response, res);
  }
};

/**
 * This method adds new task user provided data, and deletes old tasks by validating req.body
 *
 * @requires {@link handleError}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{message: string, status: boolean}} success response or error response object based on various criterias
 */
const updateTask = async (req, res) => {
  /**
   * @type {boolean}
   */
  let isTaskAdded = false;
  /**
   * @type {boolean}
   */
  let areAllTasksValid = true;

  /**
   * @type {boolean}
   */
  let areAllTimingsUnique = true;

  /**
   *
   * @type {{statusCode: number, message: string}}
   */
  let response = {
    stausCode: 500,
    message: commonConstant.GENERIC_ERROR_MESSAGE,
  };
  try {
    /**
     * @type {string}
     * @const
     */
    const email = req.body[bodyConstant.EMAIL];
    /**
     * @type {string}
     * @const
     */
    const userEmailInHeader =
      req[bodyConstant.CURRENT_USER][bodyConstant.EMAIL];

    /**
     * @type {boolean}
     * @const
     */
    const isValidEmail = validateEmail(email);

    if (!isValidEmail || email !== userEmailInHeader) {
      response = {
        statusCode: 400,
        message: `${
          bodyConstant.EMAIL.charAt(0).toUpperCase() +
          bodyConstant.EMAIL.slice(1)
        }${commonConstant.INVALID_FIELD}`,
        status: isTaskAdded,
      };
      return handleError(response, res);
    }

    let taskList = req.body[bodyConstant["TASK_LIST"]];
    if (!taskList || taskList.length === 0) {
      response = {
        statusCode: 500,
        message: `${commonConstant.INVALID_TASK_LIST}`,
        status: isTaskAdded,
      };
      return handleError(response, res);
    }

    taskList.forEach((task) => {
      if (
        task.hasOwnProperty(bodyConstant.START_TIME) &&
        task[bodyConstant.START_TIME] &&
        task.hasOwnProperty(bodyConstant.END_TIME) &&
        task[bodyConstant.END_TIME] &&
        task.hasOwnProperty(bodyConstant.TIME_USED) &&
        task[bodyConstant.TIME_USED] &&
        task.hasOwnProperty(bodyConstant.DATE_ADDED) &&
        task[bodyConstant.DATE_ADDED]
      ) {
        task[bodyConstant.EMAIL] = userEmailInHeader;
        areAllTasksValid = areAllTasksValid && true;
      } else {
        areAllTasksValid = areAllTasksValid && false;
      }
    });

    taskList = _.sortBy(taskList, bodyConstant.START_TIME);
    taskList.forEach((task, index) => {
      if (task[bodyConstant.START_TIME] < task[bodyConstant.END_TIME]) {
        const timeUsed =
          Number(
            new Date(task[bodyConstant.END_TIME]) -
              new Date(task[bodyConstant.START_TIME])
          ) / 3600000;

        if (
          task[bodyConstant.TIME_USED] > 0 &&
          timeUsed >= task[bodyConstant.TIME_USED]
        ) {
          areAllTasksValid = areAllTasksValid && true;
        } else {
          areAllTasksValid = areAllTasksValid && false;
        }
        areAllTasksValid = areAllTasksValid && true;
      } else {
        areAllTasksValid = areAllTasksValid && false;
      }

      if (index + 1 < taskList.length) {
        if (
          taskList[index][bodyConstant.START_TIME] <
            taskList[index + 1][bodyConstant.START_TIME] &&
          taskList[index + 1][bodyConstant.START_TIME] <
            taskList[index][bodyConstant.END_TIME]
        ) {
          areAllTasksValid = areAllTasksValid && false;
        }

        let currentStartTime = taskList[index][bodyConstant.START_TIME];
        let currentEndTime = taskList[index][bodyConstant.END_TIME];

        let nextStartTime = taskList[index + 1][bodyConstant.START_TIME];
        let nextEndTime = taskList[index + 1][bodyConstant.END_TIME];
        areAllTimingsUnique =
          JSON.stringify({ a: currentStartTime, b: currentEndTime }) !==
          JSON.stringify({ a: nextStartTime, b: nextEndTime });

        if (!areAllTimingsUnique) {
          areAllTasksValid = areAllTasksValid && false;
        }
      }
    });

    if (!areAllTasksValid) {
      response = {
        statusCode: 400,
        message: `${commonConstant.INVALID_TASK_LIST}`,
        status: isTaskAdded,
      };
      return handleError(response, res);
    }

    await Task.deleteMany({ email: userEmailInHeader });

    let taskIdList = [];
    const newTaskList = await Promise.all(
      await taskList.map(async (task) => {
        const newTask = new Task(task);
        const addedTask = await newTask.save();
        taskIdList.push(addedTask._id);
        return addedTask;
      })
    );

    if (newTaskList.length === taskList.length) {
      await User.findOneAndUpdate(
        { email: userEmailInHeader },
        { currentTask: taskIdList },
        { returnNewDocument: true }
      );
      isTaskAdded = true;
      response = {
        statusCode: 200,
        message: dbOperationsConstant.DATA_UPDATED,
        status: isTaskAdded,
      };
      return handleSuccess(response, res);
    } else {
      response = {
        statusCode: 500,
        message: `${dbOperationsConstant.UNABLE_TO_ADD_DATA}`,
        status: isTaskAdded,
      };
      return handleError(response, res);
    }
  } catch (error) {
    logger(error);
    response = {
      statusCode: 500,
      message: `${commonConstant.GENERIC_ERROR_MESSAGE}`,
      status: isTaskAdded,
    };
    return handleError(response, res);
  }
};

module.exports = { currentTask, updateTask };
