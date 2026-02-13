const MESSAGES = {
  // COMMON
  FETCH_SUCCESS: "Fetched successfully",
  CREATE_SUCCESS: "Created successfully",
  UPDATE_SUCCESS: "Updated successfully",
  DELETE_SUCCESS: "Deleted successfully",

  FETCH_FAILED: "Failed to fetch",
  CREATE_FAILED: "Failed to create",
  UPDATE_FAILED: "Failed to update",
  DELETE_FAILED: "Failed to delete",

  DATA_ALREADY_EXISTS: "Data already exists",
  DATA_NOT_FOUND: "Data not found",
  DATA_IN_USE: "Data is in use",
  VALIDATION_FAILED: "Validation failed",

  // TOKEN
  TOKEN_NOT_FOUND: "Token not found",
  TOKEN_EXPIRED: "Token expired",
  TOKEN_INVALID: "Invalid token",
  SESSION_EXPIRED: "Session expired",

  // PERMISSION | ACCESS
  ACCESS_DENIED: "Access denied",
  FORBIDDEN: "You do not have permission to perform this action",

  // SERVER
  INTERNAL_SERVER_ERROR: "Internal server error",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable",

  // AUTH
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Loggged out successful",
  LOGOUT_ALL_SUCCESS: "Logged out from all devices",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  INVALID_CREDENTIAL: "Invalid username or password",

  // USER
  USER_ALREADY_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",

  // ROLE
  ROLE_ALREADY_EXISTS: "Role already exists",
  ROLE_NOT_FOUND: "Role not found",

  // EMPLOYEE
  EMPLOYEE_NOT_FOUND: "Employee not found",

  // DEPARTMENT
  DEPARTMENT_NOT_FOUND: "Department not found",
};

export default MESSAGES;
