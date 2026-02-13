import { HTTP_STATUS } from "../constants/constant.js";

const apiResponse = (
  res,
  {
    success = true,
    message = "Success",
    data = null,
    statusCode = HTTP_STATUS.OK,
  } = {},
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export default apiResponse;
