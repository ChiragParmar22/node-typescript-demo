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
  authController.registerUser
);
authRoutes.post('/login', authController.loginUser);
authRoutes.post('/forgotPassword', authController.sendForgotPasswordOtp);
authRoutes.post('/resetPassword', authController.resetPassword);

export default authRoutes;
