const COMMON_CONSTANT = {
  API_STATUS_OK: "Time Tracker API is working",
  DB_CONNECTION_STATUS_OK: "Connection to Mongo DB is successful",
  INVALID_PATH: "Requested path is invalid",
  INVALID_TIME_RANGE: "Start time is greater than end time",
  INVALID_JWT: "JWT is invalid",
  REQUIRED_FIELD_BLANK: "Required field is blank",
  INVALID_TASK_LIST: "Task list is either empty or invalid",
  NAME_IS_INVALID: "Name is invalid",
  INVALID_FIELD: " is either empty or invalid",
  INVALID_BODY: "Request body or some field(s) is/are either empty or invalid",
  GENERIC_ERROR_MESSAGE: "Something went wrong",
  GENERIC_SUCCESS_MESSAGE: "Operation successful",
  UNABLE_TO_PROCESS_DATA: "Unable to process data",
  AUTHENTICATION_SUCCESSFUL: "Authentication is successful",
  AUTHENTICATION_UNSUCCESSFUL: "Authentication is unsuccessful",
  DEV_ENV: "development",
  PROD_ENV: "production",
  DEFAULT_COMMENT:
    "There is no data, please fillup something to generate insights.",
  GREAT_COMMENT:
    "Well done! You've utilised your time very well. Keep up the good work!",
  OKAY_COMMENT:
    "You've utilised most of your time, but try to remain focused and try a bit harder next time!",
  NEED_TO_IMPROVE_COMMENT:
    "Oh, Uh! It looks like you were not able to focus today. You should try harder next time!",
  SIGNOUT_SUCCESSFUL: "Sign out is successful.",
};

const DB_OPERATION_CONSTANT = {
  DATA_ADDED: "Data added succesfully",
  DATA_RETRIEVED: "Data retrieved succesfully",
  DATA_UPDATED: "Data updated succesfully",
  DATA_DELETED: "Data deleted succesfully",
  USER_ALREADY_EXISTS: "User already exists",
  USER_DOESNT_EXIST: "User doesn't exist",
  NO_DATA_FOUND: "No data found",
  UNABLE_TO_DATA_DELETED: "Unable to delete data",
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
  // TIME_TRACKER_TOKEN: "X-Time-Tracker-Authorization-Token",
  TIME_TRACKER_TOKEN: "access_token",
  START_TIME: "startTime",
  END_TIME: "endTime",
  TIME_USED: "timeUsed",
  DATE_ADDED: "dateAdded",
};

module.exports = { COMMON_CONSTANT, DB_OPERATION_CONSTANT, BODY_CONSTANT };
