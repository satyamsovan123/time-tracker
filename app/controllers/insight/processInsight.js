const { Task, User, Insight } = require("../../models");

const {
  BODY_CONSTANT,
  COMMON_CONSTANT,
  DB_OPERATION_CONSTANT,
} = require("../../../constants/constant");

const { handleError, handleSuccess, logger } = require("../../utils");

/**
 * This method processes the expired task data that is passed while user signs in, generates insights from the data and saves them to database
 *
 * @requires {@link handleError}
 * @requires {@link handleSuccess}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {({_id: ObjectId, startTime: Date, email: string, endTime: Date, dateAdded: Date, timeUsed: string}|null)} taskDetails is the array of task details, that is passed to this function while user signs in
 */

const processInsight = async (taskDetails) => {
  /**
   * To avoid any errors, the entire code is placed in try catch block
   */
  try {
    /**
     * This is the cumulative count for the total time logged in by the user
     *
     * @type {number}
     */
    let totalTimeLogged = 0;

    /**
     * This is the cumulative count for the total time used by the user
     *
     * @type {number}
     */
    let timeUsed = 0;

    /**
     * Looping over task details to capture all the details and store it in new object
     */
    taskDetails.forEach((task) => {
      /**
       * Updating total time used by the user
       */
      timeUsed = Number(timeUsed) + Number(task[BODY_CONSTANT.TIME_USED]);

      /**
       * This is the total hours for the current start and end date
       *
       * @type {number}
       */
      const maximumCurrentDuration =
        Number(
          new Date(task[BODY_CONSTANT.END_TIME]) -
            new Date(task[BODY_CONSTANT.START_TIME])
        ) / 3600000;

      /**
       * Updating total time logged in by the user
       */
      totalTimeLogged = totalTimeLogged + maximumCurrentDuration;
    });

    /**
     * This is the percentage if time that is used by the user
     *
     * @type {string}
     * @const
     */
    const percentageUsed = Number(
      (Number(timeUsed) / Number(totalTimeLogged)) * 100
    );

    /**
     * This comment is generated based on the percentage of time used by the user
     *
     * @type {string}
     */
    let comment = COMMON_CONSTANT.DEFAULT_COMMENT;
    switch (true) {
      case percentageUsed >= 80:
        comment = COMMON_CONSTANT.GREAT_COMMENT;
        break;
      case percentageUsed > 30 && percentageUsed < 80:
        comment = COMMON_CONSTANT.OKAY_COMMENT;
        break;
      case percentageUsed <= 30:
        comment = COMMON_CONSTANT.NEED_TO_IMPROVE_COMMENT;
        break;
      default:
        comment = COMMON_CONSTANT.DEFAULT_COMMENT;
        break;
    }

    /**
     * This is the new insight object with above calculated data,
     * and using the first index for getting email and date added for all tasks, as they would be same across every task in the list
     *
     * @type {{email: string, dateAdded: Date, totalTimeLogged: string, timeUsed: string, percentageUsed: string, comment: string}}
     */
    const newInsight = new Insight({
      email: taskDetails[0][BODY_CONSTANT.EMAIL],
      dateAdded: taskDetails[0][BODY_CONSTANT.DATE_ADDED],
      totalTimeLogged: totalTimeLogged,
      timeUsed: timeUsed,
      percentageUsed: percentageUsed,
      comment: comment,
    });

    /**
     * Saving the new insight for the user in the database
     */
    await newInsight.save();
    logger(newInsight);
  } catch (error) {
    /**
     * Incase of any errors in the try block, a generic error message is logged to the console
     */
    logger(error);
  }
};

module.exports = { processInsight };
