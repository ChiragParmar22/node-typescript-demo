export default {
  // Mongodb
  db_connection_success: 'Mongodb database connected successfully',
  db_connection_fail: 'Mongodb database connection failed.',

  // Common messages
  INTERNAL_SERVER_ERROR: 'Something went wrong, please try again later.',
  PERMISSION_DENIED: 'You are not allowed to access this route',
  UNAUTHORIZED_ACCESS: 'You are not authorized to perform this action.',

  APP_UPDATE_REQUIRED:
    'Please update the app to continue using it without missing any new updates.',
  DEVICE_TYPE_REQUIRED: 'Please provide a valid device type.',
  VERSION_CODE_REQUIRED: 'Please provide a valid version code.',

  // Authorization
  TOKEN_REQUIRED: 'Please provide a valid token.',
  INVALID_TOKEN: 'Invalid token.',
  USER_NOT_FOUND_TOKEN: 'User not found or user is deleted.',
  PASSWORD_CHANGED_TOKEN: 'Password changed. Please login again.',
  TOKEN_EXPIRED: 'Token has expired. Please login again.',
  TOKEN_REFRESHED_SUCCESS: 'Token refreshed successfully',

  // OTP
  REGISTRATION_OTP_SENT: 'Registration OTP sent successfully',
  INVALID_OTP: 'Invalid OTP.',
  FORGOT_PASSWORD_OTP_SENT: 'Forgot password OTP sent successfully',

  // Register
  USER_EXIST:
    'User already exists with the given email, please provide another email.',
  REGISTRATION_SUCCESS: 'You have successfully registered.',
  PROFILE_UPDATE: 'Profile updated successfully',

  // Login
  USER_NOT_FOUND_EMAIL: 'User not found with the given email.',
  INVALID_CREDENTIALS: 'Invalid login credentials.',
  LOGIN_SUCCESS: 'User logged in successfully',

  // Password
  NEW_PASSWORD_SAME: 'New password cannot be the same as the old password.',
  PASSWORD_RESET_SUCCESS: 'Your password has been reset successfully.',
  INCORRECT_CURRENT_PASSWORD: 'Incorrect current password.',
  PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',

  LOGOUT: "You've been logged out, fare thee well.",

  PASSWORD_NOT_MATCH:
    'Password must be strong. At least one upper case alphabet, one lower case alphabet, one digit, one special character, and be between 8 to 12 characters long.',
  CONFIRM_PASSWORD_NOT_SAME: 'Password and confirm password should be the same',
};
