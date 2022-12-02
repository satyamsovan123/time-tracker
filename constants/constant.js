const COMMON_CONSTANT = {
  API_STATUS_OK: "Time Tracker API is working.",
  DB_CONNECTION_STATUS_OK: "Connection to Mongo DB is successful.",
  INVALID_PATH: "Requested path is invalid.",
  INVALID_TIME_RANGE: "Start time cannot be greater than end time.",
  INVALID_JWT: "JWT is invalid.",
  REQUIRED_FIELD_BLANK: "Required field is blank.",
  INVALID_TASK_LIST:
    "Task list is either empty or invalid. Please check again and submit.",
  NAME_IS_INVALID:
    "Invalid name, please provide a valid name with letters and numbers.",
  INVALID_FIELD: " is either empty or invalid",
  INVALID_BODY:
    "The entered field(s) is/are either empty or invalid. Please check again and submit.",
  GENERIC_ERROR_MESSAGE:
    "Sorry, some error occured on our side. Please try again after some time.",
  GENERIC_SUCCESS_MESSAGE: "Successful",
  UNABLE_TO_PROCESS_DATA:
    "Sorry, we are unable to process your data. Please try again after some time.",
  AUTHENTICATION_SUCCESSFUL: "Sign in was successful.",
  AUTHENTICATION_UNSUCCESSFUL:
    "The email and password did not match our records. Please try again with correct credentials.",
  DEV_ENV: "development",
  PROD_ENV: "production",
  DEFAULT_COMMENT:
    "There is no data, please fillup something to generate insights.",
  GREAT_COMMENT:
    "Well done! You've utilised your time very well. Keep up the good work!",
  OKAY_COMMENT:
    "You've utilised most of your time, but try to remain focused and try a bit harder next time!",
  NEED_TO_IMPROVE_COMMENT:
    "It looks like you were not able to focus. You should try harder next time!",
  SIGNOUT_SUCCESSFUL: "Sign out was successful.",
};

const DB_OPERATION_CONSTANT = {
  USER_DATA_ADDED: "You are now ready to take control of your time!",
  DATA_RETRIEVED: "Data retrieved succesfully",
  SINGLE_TIME_DATA_UPDATED: "Timing is added.",
  MULTIPLE_TIME_DATA_UPDATED: "The time sheet is updated.",
  INSIGHT_DATA_DELETED: "Insight for the date is deleted successfully.",
  PROFILE_DATA_DELETED:
    "Your account is deleted. And, we are sad to see you go.",
  USER_ALREADY_EXISTS: "An user already exists, probably your evil twin?",
  USER_DOESNT_EXIST:
    "The email and password did not match our records. Please try again with correct credentials.",
  NO_DATA_FOUND: "No data found",
  UNABLE_TO_DELETE_DATA: "Unable to delete data",
  UNABLE_TO_RETRIEVE_DATA: "Unable to retrieve data",
  UNABLE_TO_ADD_DATA: "Unable to add data",
  UNABLE_TO_UPDATE_DATA: "Unable to update data",
  UNABLE_TO_DELETE_DATA: "Unable to delete requested data",
};

const BODY_CONSTANT = {
  BODY: "body",
  EMAIL: "email",
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  PASSWORD: "password",
  CURRENT_DATE: "currentDate",
  CURRENT_TASK: "currentTask",
  TASK_LIST: "taskList",
  CURRENT_USER: "currentUser",
  ACCESS_TOKEN: "access_token",
  START_TIME: "startTime",
  END_TIME: "endTime",
  TIME_USED: "timeUsed",
  DATE_ADDED: "dateAdded",
};

module.exports = { COMMON_CONSTANT, DB_OPERATION_CONSTANT, BODY_CONSTANT };
