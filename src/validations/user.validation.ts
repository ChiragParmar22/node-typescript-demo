import Joi from 'joi';
import { ROLES } from '../constants/key.constants';
const userValidation: any = {};

const passwordFormat =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
// const dateFormat = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
const phoneFormat = /^\d{10}$/; // 10 digit phone number

userValidation.sendOtpSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string().valid(ROLES.USER, ROLES.SERVICE_PROVIDER).required(),
  }),
};

userValidation.registerUserSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    gender: Joi.string().valid('male', 'female').required(),
    address: Joi.string().optional().allow('', null),
    lattitude: Joi.number().required(),
    longitude: Joi.number().required(),
    phone: Joi.string().pattern(phoneFormat).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordFormat).required().messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid('user', 'serviceProvider').required(),
    profileImage: Joi.string().optional().allow('', null),
    deviceType: Joi.string().valid('android', 'ios').optional(),
    deviceToken: Joi.string().allow('', null).optional(),
    otp: Joi.number().required(),
  }),
};

userValidation.loginUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordFormat).required().messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    }),
    role: Joi.string().valid('user', 'serviceProvider').required(),
    deviceType: Joi.string().valid('android', 'ios').optional(),
    deviceToken: Joi.string().allow('', null).optional(),
  }),
};

userValidation.forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('user', 'serviceProvider').required(),
  }),
};

userValidation.resetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordFormat).required().messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid('user', 'serviceProvider').required(),
    otp: Joi.number().required(),
  }),
};

userValidation.updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    gender: Joi.string().valid('male', 'female').required(),
    address: Joi.string().optional().allow('', null),
    lattitude: Joi.number().required(),
    longitude: Joi.number().required(),
    profileImage: Joi.string().optional().allow('', null),
  }),
};

userValidation.changePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().pattern(passwordFormat).required().messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    }),
    newPassword: Joi.string().pattern(passwordFormat).required().messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    }),
    confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
  }),
};

export default userValidation;
