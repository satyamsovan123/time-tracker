const commonConstant = {
  API_STATUS_OK: "Time Tracker API is working",
  DB_CONNECTION_STATUS_OK: "Connection to Mongo DB is successful",
  INVALID_PATH: "Requested path is invalid",
  INVALID_JWT: "JWT is invalid",
  REQUIRED_FIELD_BLANK: "Required field is blank",
  INVALID_FIELD: " is either empty or invalid",
  INVALID_BODY: "Request body or some field(s) is/are either empty or invalid",
  GENERIC_ERROR_MESSAGE: "Something went wrong",
  UNABLE_TO_PROCESS_DATA: "Unable to process data",
  AUTHENTICATION_SUCCESSFUL: "Authentication is successful",
  AUTHENTICATION_UNSUCCESSFUL: "Authentication is unsuccessful",
  DEV_ENV: "Development",
  PROD_ENV: "Production",
};

const dbOperationsConstant = {
  DATA_ADDED: "Data added succesfully",
  USER_ALREADY_EXISTS: "User already exists",
  USER_DOESNT_EXIST: "User doesn't exist",
  DATA_UPDATED: "Data updated succesfully",
  UNABLE_TO_ADD_DATA: "Unable to add data",
  UNABLE_TO_UPDATE_DATA: "Unable to update data",
  UNABLE_TO_DELETE_DATA: "Unable to delete requested data",
};

const bodyConstant = {
  BODY: "body",
  EMAIL: "email",
  PASSWORD: "password",
  CURRENT_DATE: "currentDate",
};

module.exports = { commonConstant, dbOperationsConstant, bodyConstant };
