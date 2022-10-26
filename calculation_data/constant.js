const appConstant = {
    EVERY_10S: "*/10 * * * * *",
    EVERY_1MINUTE: "* * * * *",
    EVERY_HOUR: "0 * * * *",
    EVERY_6HOUR: "0 */6 * * *",
    EVERY_DAY: "0 0 * * *",
    ERROR_PARSE_JSON: "parse JSON error ",
    ERROR_RECORD_FORMAT: "record format don't match",
    ERROR_INSERT_MONGO: "insert record to mongo error",
  };

const appMessage = {
    NOT_AUTH: "Không có quyền truy cập tài nguyên",
    SERVER_ERROR: "Máy chủ xảy ra lỗi, vui lòng thử lại sau",
  };

const returnCode = {
    TIME_OUT  : 1,
    SUCCESS : 2 ,
    FAIL : 3,
  }

module.exports =  { appConstant, appMessage, returnCode };