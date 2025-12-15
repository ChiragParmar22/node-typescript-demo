import express from 'express';
import { upload } from '../util/fileUtil/fileUpload';
import routeMiddlewares from '../middleware/routeMiddleware';
import userValidation from '../validations/user.validation';
import authController from '../controllers/auth.controller';

const authRoutes = express.Router();

authRoutes.post(
  '/sendOtp',
  routeMiddlewares.validateRequest(userValidation.sendOtpSchema),
  authController.sendOtp
);
authRoutes.post(
  '/register',
  upload.single('profileImage'),
  routeMiddlewares.validateRequest(userValidation.registerUserSchema),
  authController.registerUser
);
authRoutes.post(
  '/login',
  routeMiddlewares.validateRequest(userValidation.loginUserSchema),
  authController.loginUser
);
authRoutes.post(
  '/forgotPassword',
  routeMiddlewares.validateRequest(userValidation.forgotPasswordSchema),
  authController.sendForgotPasswordOtp
);
authRoutes.post(
  '/resetPassword',
  routeMiddlewares.validateRequest(userValidation.resetPasswordSchema),
  authController.resetPassword
);
authRoutes.post(
  '/refreshToken',
  routeMiddlewares.validateRequest(userValidation.refreshTokenSchema),
  authController.refreshToken
);

export default authRoutes;
