const User = require("../../models/User");
const { validateEmail } = require("../../utils/validateEmail");
const {
  commonConstant,
  dbOperationsConstant,
  bodyConstant,
} = require("../../../constants/constant");

const { logger } = require("../../utils/logger");
const { handleError, handleSuccess } = require("../../utils");
const { currentTask } = require("../task");
const Task = require("../../models/Task");

/**
 * This method returns the details for an authenticated user
 *
 * @requires {@link validateEmail}
 * @requires {@link handleError}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body that is received by server
 * @param {{}} res is the response body that will be sent to client
 * @returns {{message: string, status: boolean}} success response with data or error response object based on various criterias
 */
const profile = async (req, res) => {
  /**
   * @type {boolean}
   */
  let isProfileFetched = false;

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
        status: isProfileFetched,
      };
      return handleError(response, res);
    }

    /**
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId]}|null)}
     * @const
     */
    const existingUser = await User.findOne({
      email: userEmailInHeader,
    }).select("-_id firstName lastName currentTask");
    logger(existingUser);
    if (!existingUser) {
      response = {
        statusCode: 404,
        message: `${dbOperationsConstant.USER_DOESNT_EXIST}`,
        status: isProfileFetched,
      };
      return handleError(response, res);
    } else {
      isProfileFetched = true;
      const taskList = [];
      existingUser[bodyConstant["CURRENT_TASK"]] = taskList;
      response = {
        data: existingUser,
        statusCode: 200,
        message: dbOperationsConstant.DATA_RETRIEVED,
        status: isProfileFetched,
      };
      return handleSuccess(response, res);
    }
  } catch (error) {
    logger(error);
    isProfileFetched = false;
    response = {
      statusCode: 500,
      message: `${commonConstant.GENERIC_ERROR_MESSAGE}`,
      status: isProfileFetched,
    };
    return handleError(response, res);
  }
};

/**
 * This method deletes the user and the details from the database
 *
 * @requires {@link validateEmail}
 * @requires {@link handleError}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 *
 * @param {{}} req is the request body that is received by server
 * @param {{}} res is the response body that will be sent to client
 * @returns {{message: string, status: boolean}} success response or error response object based on various criterias
 */
const deleteProfile = async (req, res) => {
  /**
   * @type {boolean}
   */
  let isProfileDeleted = false;

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

    /**
     * @type {boolean}
     * @const
     */
    const isValidEmail = validateEmail(email);

    const userEmailInHeader =
      req[bodyConstant.CURRENT_USER][bodyConstant.EMAIL];

    if (!isValidEmail || email !== userEmailInHeader) {
      response = {
        statusCode: 400,
        message: `${
          bodyConstant.EMAIL.charAt(0).toUpperCase() +
          bodyConstant.EMAIL.slice(1)
        }${commonConstant.INVALID_FIELD}`,
        status: isProfileDeleted,
      };
      return handleError(response, res);
    }

    /**
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId]}|null)}
     * @const
     */
    const existingUser = await User.deleteOne({ email: userEmailInHeader });
    logger(existingUser);
    if (!existingUser || existingUser.deletedCount === 0) {
      response = {
        statusCode: 404,
        message: `${dbOperationsConstant.USER_DOESNT_EXIST}`,
        status: isProfileDeleted,
      };
      return handleError(response, res);
    } else {
      await Task.deleteMany({ email: userEmailInHeader });
      isProfileDeleted = true;
      response = {
        statusCode: 200,
        message: dbOperationsConstant.DATA_DELETED,
        status: isProfileDeleted,
      };
      return handleSuccess(response, res);
    }
  } catch (error) {
    logger(error);
    response = {
      statusCode: 500,
      message: `${commonConstant.GENERIC_ERROR_MESSAGE}`,
      status: isProfileDeleted,
    };
    return handleError(response, res);
  }
};

module.exports = { profile, deleteProfile };
