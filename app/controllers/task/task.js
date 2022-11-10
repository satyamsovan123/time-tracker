const Task = require("../../models/Task");
const {
  commonConstant,
  dbOperationsConstant,
  bodyConstant,
} = require("../../../constants/constant");

const { logger } = require("../../utils/logger");
const { handleError, handleSuccess } = require("../../utils");

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
const currentTask = async (taskIdList) => {
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
    if (!taskIdList || taskIdList.length === 0) {
      return taskList;
    }

    await Promise.all(
      await taskIdList.map(async (taskId) => {
        // return await convertToUpperCase(word);
        await Task.find({ _id: taskId })
          .select("_id startTime endTime timeUsed dateAdded")
          .then((taskDetails) => {
            taskList.push(taskDetails[0]);
          });
        // taskList.push(taskDetails);
      })
    );

    // taskIdList.forEach(async (taskId) => {
    //   console.log("before");
    //   await Task.find({ _id: taskId })
    //     .select("-_id startTime endTime timeUsed dateAdded")
    //     .then((taskDetails) => {
    //       taskList.push(taskDetails);
    //     });
    //   console.log("inl", taskList);
    //   console.log("after");
    // });
    // console.log("out", taskList);
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
 * This method adds new task user provided data, by validating email key and password key in the request body
 * and the checking for the user's existence
 *
 * @requires {@link handleError}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{message: string, status: boolean}} success response or error response object based on various criterias
 */
const addNewTask = async (req, res) => {
  /**
   * @type {boolean}
   */
  let isTaskAdded = false;
  /**
   * @type {boolean}
   */
  let areAllTasksValid = true;
  /**
   * @type {{statusCode: number, message: string}}
   */
  let response = {
    stausCode: 500,
    message: commonConstant.GENERIC_ERROR_MESSAGE,
  };
  try {
    const taskList = req.body[bodyConstant["TASK_LIST"]];
    if (!taskList || taskList.length === 0) {
      response = {
        statusCode: 500,
        message: `${commonConstant.INVALID_TASK_LIST}`,
        status: isTaskAdded,
      };
      return handleError(response, res);
    }
    const userEmail = req[bodyConstant.CURRENT_USER][bodyConstant.EMAIL];
    logger(userEmail);
    logger(taskList);
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
        task[bodyConstant.EMAIL] = userEmail;
        areAllTasksValid = areAllTasksValid && true;
      } else {
        areAllTasksValid = areAllTasksValid && false;
      }
    });

    if (!areAllTasksValid) {
      response = {
        statusCode: 500,
        message: `${commonConstant.INVALID_TASK_LIST}`,
        status: isTaskAdded,
      };
      return handleError(response, res);
    }

    const currentTasksForUser = await Task.deleteMany({ email: userEmail });

    const newTaskList = await Promise.all(
      await taskList.map(async (task) => {
        const newTask = new Task(task);
        const addedTask = await newTask.save();
        return addedTask;
      })
    );
    logger(newTaskList);
    if (newTaskList.length === taskList.length) {
      isTaskAdded = true;
      response = {
        statusCode: 200,
        message: dbOperationsConstant.DATA_UPDATED,
        status: isTaskAdded,
      };
      return handleSuccess(response, res);
    } else {
      logger(error);
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

/**
 * This method
 *
 * @requires {@link validateEmail}
 * @requires {@link handleError}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{message: string, status: boolean}} success response or error response object based on various criterias
 */
const updateTask = async (req, res) => {
  const hours1 = 17;
  const minutes1 = 30;
  const date1 = new Date();
  date1.setHours(hours1, minutes1);

  const hours2 = 20;
  const minutes2 = 10;
  const date2 = new Date();
  date2.setHours(hours2, minutes2);

  const timeUsed = (date2 - date1) / 3600000;
  const newTask = new Task({
    startTime: date1,
    endTime: date2,
    timeUsed: String(timeUsed),
    dateAdded: new Date(),
  });

  let x = await newTask.save();
  res.send(x);
};

module.exports = { currentTask, addNewTask, updateTask };
