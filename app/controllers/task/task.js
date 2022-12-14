const _ = require("lodash");

const { Task, User } = require("../../models");

const {
  COMMON_CONSTANT,
  DB_OPERATION_CONSTANT,
  BODY_CONSTANT,
} = require("../../../constants/constant");

const {
  handleError,
  handleSuccess,
  logger,
  validateEmail,
} = require("../../utils");

/**
 * This method returns the task details for the provided user email
 *
 * @requires {@link handleError}
 * @requires {@link handleSuccess}
 * @requires {@link logger}
 * @requires {@link validateEmail}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body that is received by server, it has email in the req.body and userEmailInHeader (custom property) passed by the validateJWT middleware
 * @param {{}} res is the response body that will be sent to client
 * @returns {{message: string, status: boolean}} success response with data or error response object based on various criterias
 */
const currentTask = async (req, res) => {
  /**
   * This is the status of the current operation
   *
   * @type {boolean}
   */
  let status = false;

  /**
   * This is the response that is sent to client
   *
   * @type {{statusCode: number, message: string, status: status}}
   */
  let response = {
    stausCode: 500,
    message: COMMON_CONSTANT.GENERIC_ERROR_MESSAGE,
    status: status,
  };

  /**
   * This is the task list
   *
   * @type {[]}
   */
  let taskList = [];

  /**
   * To avoid any errors, the entire code is placed in try catch block
   */
  try {
    /**
     * This is the email passed by the client in request body
     *
     * @type {string}
     * @const
     */
    const email = req.body[BODY_CONSTANT.EMAIL];

    /**
     * This is the email passed the validateJWT middleware
     *
     * @type {string}
     * @const
     */
    const userEmailInHeader =
      req[BODY_CONSTANT.CURRENT_USER][BODY_CONSTANT.EMAIL];

    /**
     * This is the status of the validity of email passed by client in request body
     *
     * @type {boolean}
     * @const
     */
    const isValidEmail = validateEmail(email);

    /**
     * Checking if the email from request body is not valid and if it is not same as the email passed by the validateJWT middleware
     */
    if (!isValidEmail || email !== userEmailInHeader) {
      response = {
        statusCode: 401,
        message: `${
          BODY_CONSTANT.EMAIL.charAt(0).toUpperCase() +
          BODY_CONSTANT.EMAIL.slice(1)
        }${COMMON_CONSTANT.INVALID_FIELD}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * The task list is updated with the documents fetched from database (with selected properties of document)
     */
    taskList = await Task.find({ email: userEmailInHeader }).select(
      "-_id -email -__v -dateAdded"
    );

    logger(taskList);

    /**
     * Task list is then sent to client
     */
    status = true;
    response = {
      data: taskList,
      statusCode: 200,
      message: `${DB_OPERATION_CONSTANT.DATA_RETRIEVED}`,
      status: status,
    };
    return handleSuccess(response, res);
  } catch (error) {
    /**
     * Incase of any errors in the try block, a generic error message is returned to the user and error is logged to the console
     */
    logger(error);
    response = {
      statusCode: 500,
      message: `${COMMON_CONSTANT.GENERIC_ERROR_MESSAGE}`,
      status: status,
    };
    return handleError(response, res);
  }
};

/**
 * This method replaces old task with the new task that is provided by the client (it deletes old tasks)
 *
 * @requires {@link handleError}
 * @requires {@link handleSuccess}
 * @requires {@link logger}
 * @requires {@link validateEmail}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{message: string, status: boolean}} success response or error response object based on various criterias
 */
const updateTask = async (req, res) => {
  /**
   * This is the status of the current operation
   *
   * @type {boolean}
   */
  let status = false;

  /**
   * This is the response that is sent to client
   *
   * @type {{statusCode: number, message: string, status: status}}
   */
  let response = {
    stausCode: 500,
    message: COMMON_CONSTANT.GENERIC_ERROR_MESSAGE,
    status: status,
  };

  /**
   * This is the task list
   *
   * @type {[]}
   */
  let taskList = [];

  /**
   * This is the status of the validation for the tasks details provided by the user, it is needed to check if time in the tasks are valid
   *
   * @type {boolean}
   */
  let areAllTasksValid = true;

  /**
   * This is the status of the validation for the tasks details provided by the user, it is needed to check for duplicate tasks
   *
   * @type {boolean}
   */
  let areAllTimingsUnique = true;

  /**
   * To avoid any errors, the entire code is placed in try catch block
   */
  try {
    /**
     * This is the email passed by the client in request body
     *
     * @type {string}
     * @const
     */
    const email = req.body[BODY_CONSTANT.EMAIL];

    /**
     * This is the email passed the validateJWT middleware
     *
     * @type {string}
     * @const
     */
    const userEmailInHeader =
      req[BODY_CONSTANT.CURRENT_USER][BODY_CONSTANT.EMAIL];

    /**
     * This is the status of the validity of email passed by client in request body
     *
     * @type {boolean}
     * @const
     */
    const isValidEmail = validateEmail(email);

    /**
     * Checking if the email from request body is not valid and if it is not same as the email passed by the validateJWT middleware
     */
    if (!isValidEmail || email !== userEmailInHeader) {
      response = {
        statusCode: 401,
        message: `${
          BODY_CONSTANT.EMAIL.charAt(0).toUpperCase() +
          BODY_CONSTANT.EMAIL.slice(1)
        }${COMMON_CONSTANT.INVALID_FIELD}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * This is the user document that is fetched after querying from the database
     *
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId]}|null)}
     * @const
     */
    const existingUser = await User.findOne({ email: userEmailInHeader });

    /**
     * Checking if the user doesn't exists, then returning an error
     */
    if (!existingUser) {
      response = {
        statusCode: 404,
        message: `${DB_OPERATION_CONSTANT.USER_DOESNT_EXIST}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * The tasklist is updated with the details provided by the user
     */
    taskList = req.body[BODY_CONSTANT["TASK_LIST"]];

    /**
     * Checking if the task list from request body is empty
     */
    if (!taskList || taskList.length === 0) {
      response = {
        statusCode: 500,
        message: `${COMMON_CONSTANT.INVALID_TASK_LIST}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * Looping over the task list and checking for each task object, if each task object has start time, end time, time used and date added property, and also checking if they are empty, if that is true, then returning an error
     */
    taskList.forEach((task) => {
      if (
        task.hasOwnProperty(BODY_CONSTANT.START_TIME) &&
        task[BODY_CONSTANT.START_TIME] &&
        task.hasOwnProperty(BODY_CONSTANT.END_TIME) &&
        task[BODY_CONSTANT.END_TIME] &&
        task.hasOwnProperty(BODY_CONSTANT.TIME_USED) &&
        task[BODY_CONSTANT.TIME_USED] &&
        task.hasOwnProperty(BODY_CONSTANT.DATE_ADDED) &&
        task[BODY_CONSTANT.DATE_ADDED]
      ) {
        task[BODY_CONSTANT.EMAIL] = userEmailInHeader;
        areAllTasksValid = areAllTasksValid && true;
      } else {
        logger("Invalid fields");
        areAllTasksValid = areAllTasksValid && false;
      }
    });

    /**
     * Sorting the tasklist by the start time
     */
    taskList = _.sortBy(taskList, BODY_CONSTANT.START_TIME);

    /**
     * Looping over the task list and checking for each task object, and if any discrepancies are found, then returning an error
     */
    taskList.forEach((task, index) => {
      /**
       * Checking if start time is lesser than end time (startTime < endTime) and checking if user provided time used is lesser than or equal to the difference between actual end time and start time (maximumDuration <= (endTime - startTime))
       */
      if (task[BODY_CONSTANT.START_TIME] < task[BODY_CONSTANT.END_TIME]) {
        const maximumDuration =
          Number(
            new Date(task[BODY_CONSTANT.END_TIME]) -
              new Date(task[BODY_CONSTANT.START_TIME])
          ) / 3600000;
        if (
          task[BODY_CONSTANT.TIME_USED] > 0 &&
          maximumDuration >= task[BODY_CONSTANT.TIME_USED]
        ) {
          areAllTasksValid = areAllTasksValid && true;
        } else {
          logger("Invalid time used");
          areAllTasksValid = areAllTasksValid && false;
        }
        areAllTasksValid = areAllTasksValid && true;
      } else {
        logger("Invalid range");
        areAllTasksValid = areAllTasksValid && false;
      }

      if (index + 1 < taskList.length) {
        /**
         * Since every task details object is sorted, checking here if the i + 1 th index start time falls between i the index's start time and end time, if it does, it means that the i + 1 th entry is invalid, so that makes whole list invalid
         *
         * An example would be, it captures the below case, row 2 is invalid since the timings falls between row 1's timing
         * |-------------------------|
         * |  startTime  |  endTime  |
         * |-------------------------|
         * |      13     |     19    |
         * |      14     |     20    |
         * |      03     |     05    |
         * ---------------------------
         */
        if (
          taskList[index][BODY_CONSTANT.START_TIME] <
            taskList[index + 1][BODY_CONSTANT.START_TIME] &&
          taskList[index + 1][BODY_CONSTANT.START_TIME] <
            taskList[index][BODY_CONSTANT.END_TIME]
        ) {
          logger("Repeated timings");
          areAllTasksValid = areAllTasksValid && false;
        }

        /**
         * Since every task details object is sorted, checking if every start time and end time provided is unique
         */

        /**
         * This is the ith index's start time
         *
         * @type {date}
         */
        let currentStartTime = taskList[index][BODY_CONSTANT.START_TIME];

        /**
         * This is the ith index's end time
         *
         * @type {date}
         */
        let currentEndTime = taskList[index][BODY_CONSTANT.END_TIME];

        /**
         * This is the i + 1 th index's start time
         *
         * @type {date}
         */
        let nextStartTime = taskList[index + 1][BODY_CONSTANT.START_TIME];

        /**
         * This is the i + 1 th index's end time
         *
         * @type {date}
         */
        let nextEndTime = taskList[index + 1][BODY_CONSTANT.END_TIME];

        /**
         * The variable is updated to hold data if the i th index start and end time are equal to i + 1 th index start and end time
         */
        areAllTimingsUnique =
          JSON.stringify({ a: currentStartTime, b: currentEndTime }) !==
          JSON.stringify({ a: nextStartTime, b: nextEndTime });

        /**
         * Chekcking if all time calculated above are not unique
         */
        if (!areAllTimingsUnique) {
          logger("Duplicate fields");
          areAllTasksValid = areAllTasksValid && false;
        }
      }
    });

    /**
     * Checking if all the above checks are not valid, then returning an error
     */
    if (!areAllTasksValid) {
      response = {
        statusCode: 400,
        message: `${COMMON_CONSTANT.INVALID_TASK_LIST}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * Deleting the tasks related to user provided email (in order to have new data)
     */
    await Task.deleteMany({ email: userEmailInHeader });

    /**
     * This is the list that will contain new Object Ids for newly created tasks
     *
     * @type {[]}
     */
    let taskIdList = [];

    /**
     * This will hold the new task documents after all promises are resolved
     *
     * @type {[]}
     * @const
     */
    const newTaskList = await Promise.all(
      await taskList.map(async (task) => {
        /**
         * This is the new task that would be saved into the database
         *
         * @type {({_id: ObjectId, email: string, startTime: date, endTime: date, timeUsed: string, dateAdded: date, }|null)}
         * @const
         */
        const newTask = new Task(task);

        /**
         * This is the task document that is saved in the database
         *
         * @type {({_id: ObjectId, email: string, startTime: date, endTime: date, timeUsed: string, dateAdded: date, }|null)}
         * @const
         */
        const addedTask = await newTask.save();

        /**
         * Pushing the new task's Object Id to taskIdList
         */
        taskIdList.push(addedTask._id);
        return addedTask;
      })
    );

    /**
     * Checking if the total elements in the newTaskList (total created tasks) is equal to the task list proivded by the user, then returning success response, else returning error response
     */
    if (newTaskList.length === taskList.length) {
      await User.findOneAndUpdate(
        { email: userEmailInHeader },
        { currentTask: taskIdList },
        { returnNewDocument: true }
      );
      status = true;
      response = {
        statusCode: 200,
        message: `${
          newTaskList.length === 1
            ? DB_OPERATION_CONSTANT.SINGLE_TIME_DATA_UPDATED
            : DB_OPERATION_CONSTANT.MULTIPLE_TIME_DATA_UPDATED
        }`,
        status: status,
      };

      logger(taskIdList);
      return handleSuccess(response, res);
    } else {
      response = {
        statusCode: 500,
        message: `${DB_OPERATION_CONSTANT.UNABLE_TO_ADD_DATA}`,
        status: status,
      };
      return handleError(response, res);
    }
  } catch (error) {
    /**
     * Incase of any errors in the try block, a generic error message is returned to the user and error is logged to the console
     */
    logger(error);
    response = {
      statusCode: 500,
      message: `${COMMON_CONSTANT.GENERIC_ERROR_MESSAGE}`,
      status: status,
    };
    return handleError(response, res);
  }
};

module.exports = { currentTask, updateTask };
