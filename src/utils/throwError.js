import { HTTP_STATUS } from "../constants/constant.js";

const throwError = (
  message,
  statusCode = HTTP_STATUS.BAD_REQUEST,
  data = null,
) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.data = data;
  throw error;
};

export default throwError;
