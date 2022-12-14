const bcrypt = require("bcrypt");
const moment = require("moment-timezone");

const { User, Task } = require("../../models");

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
const { generateJWT } = require("../../middlewares/JWT");
const { processInsight } = require("../insight");

/**
 * This method verifies user provided credentials, by validating email and password in the request body
 * and then checking for the user existence. Then the entered plaintext password and hased databased passwords are matched using bcrypt
 *
 * @requires {@link handleError}
 * @requires {@link handleSuccess}
 * @requires {@link logger}
 * @requires {@link validateEmail}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{message: string, status: boolean}} success response (with JWT as cookies) or error response object based on various criterias
 */
const signin = async (req, res) => {
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
   * To avoid any errors, the entire code is placed in try catch block
   */
  try {
    /**
     * This is the email passed by the client in request body
     *
     *  @type {string}
     * @const
     */
    const email = req.body[BODY_CONSTANT.EMAIL];

    /**
     * This is the status of the validity of email passed by client in request body
     *
     * @type {boolean}
     * @const
     */
    const isValidEmail = validateEmail(email);

    /**
     * This is the password in plain text (not ecrypted) passed by the client in request body
     *
     * @type {string}
     * @const
     */
    const plainTextPassword = req.body[BODY_CONSTANT.PASSWORD];

    /**
     * Checking if the email from request body is not valid
     */
    if (!isValidEmail) {
      response = {
        statusCode: 400,
        message: `${
          BODY_CONSTANT.EMAIL.charAt(0).toUpperCase() +
          BODY_CONSTANT.EMAIL.slice(1)
        }${COMMON_CONSTANT.INVALID_FIELD}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * Checking if the password from request body is not valid
     */
    if (!plainTextPassword || !plainTextPassword.length) {
      response = {
        statusCode: 400,
        message: `${
          BODY_CONSTANT.PASSWORD.charAt(0).toUpperCase() +
          BODY_CONSTANT.PASSWORD.slice(1)
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
    const existingUser = await User.findOne({ email: email });

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
     * This is the hashed password that is stored in the database
     *
     * @type {String}
     * @const
     */
    const encryptedPassword = existingUser.password;

    /**
     * This is the status of the comparision of the hased password and the user entered password
     *
     * @type {boolean}
     * @const
     */
    const isPasswordCorrect = await bcrypt.compare(
      plainTextPassword,
      encryptedPassword
    );

    /**
     * Checking if the password comparision is true, then generating and returning a token to handleSuccess method, else returning an error
     */
    if (isPasswordCorrect) {
      /**
       * This is the token that is generated by the generateJWT function
       *
       * @type {string}
       * @const
       */
      const token = await generateJWT(existingUser);
      status = true;
      response = {
        statusCode: 200,
        message: COMMON_CONSTANT.AUTHENTICATION_SUCCESSFUL,
        status: status,
      };

      logger(existingUser);
      logger(token);

      /**
       * NOTE: This below logic is kind of redundant, but still it's just sitting here!
       */

      /**
       * This is the task list for the logged in user, it has startTime, endTime and dateAdded in UTC format (we need to convert it)
       *
       * @type {({_id: ObjectId, startTime: Date, endTime: Date, dateAdded: Date, timeUsed: string}|null)}
       * @const
       */
      const taskList = await Task.find({
        email: existingUser[BODY_CONSTANT.EMAIL],
      });

      /**
       * This is the task list id list for the logged in user that will be updated later
       *
       * @type {[]}
       */
      let taskIdList = [];

      /**
       * This is the backup of the task list, which will store expired tasks
       *
       * @type {[]}
       */
      let backupOfTaskList = [];

      /**
       * Checking if task list has some tasks in it i.e if the length of the task list that is fetched from database, is more than 0
       */
      if (taskList && taskList.length > 0) {
        /**
         * NOTE: Since, all these things are done everytime, so signup slows down!
         * On every login, looping through each task and checking if the created tasks are expired
         * the date comes from client as local time zone (say IST), but MongoDB stores dates in UTC, so converting UTC to local time zone and checking if task is expired (i.e. dateAdded < currentDate), also pushing these old tasks in a backup variable, which will be used to process and store information
         */
        taskList.forEach(async (task) => {
          /**
           * This is the dateAdded for all the tasks that is received in UTC, that is then converted to local time zone (we only extract the date here)
           *
           * @type {date}
           * @const
           */
          const dateAddedLocalTimeZone = new moment(task.dateAdded).format(
            "DD-MM-YYYY"
          );

          /**
           * This is the current time in UTC, that is then converted to local time zone (we only extract the date here)
           *
           * @type {date}
           * @const
           */
          const currentDateLocalTimeZone = new moment(new Date()).format(
            "DD-MM-YYYY"
          );

          /**
           * Checking if the current time is more that the date added for the current task, then taking backup of the task (by pushing it to an array) and then deleting the tasks, else if the task are not expired for current date, then those task ids are preserved, to update corresponding user document
           */
          if (dateAddedLocalTimeZone < currentDateLocalTimeZone) {
            backupOfTaskList.push(task);
            await Task.findByIdAndDelete(task._id);
          } else {
            taskIdList.push(task._id);
          }
        });

        /**
         * Checking if backup of expired task list is completed (which means there were some expired tasks, which needs procesing), then calling this method to process the list of expired data, that would be used to populate dashboard
         */
        if (backupOfTaskList.length) await processInsight(backupOfTaskList);

        /**
         * Updating the user document with new task ids
         */
        await User.findOneAndUpdate(
          { email: existingUser[BODY_CONSTANT.EMAIL] },
          { currentTask: taskIdList },
          { returnNewDocument: false }
        );
      }

      return handleSuccess(response, res, token);
    } else {
      response = {
        statusCode: 401,
        message: `${COMMON_CONSTANT.AUTHENTICATION_UNSUCCESSFUL}`,
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

module.exports = { signin };
