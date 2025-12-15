import express from 'express';
import { upload } from '../util/fileUtil/fileUpload';
import routeMiddlewares from '../middleware/routeMiddleware';
import userValidation from '../validations/user.validation';
import authorize from '../middleware/auth.middleware';
import userController from '../controllers/user.controller';

const userRoutes = express.Router();

userRoutes.use(authorize);
userRoutes.post(
  '/updateProfile',
  upload.single('profileImage'),
  routeMiddlewares.validateRequest(userValidation.updateProfileSchema),
  userController.updateProfile
);
userRoutes.post(
  '/changePassword',
  routeMiddlewares.validateRequest(userValidation.changePasswordSchema),
  userController.changePassword
);

export default userRoutes;
