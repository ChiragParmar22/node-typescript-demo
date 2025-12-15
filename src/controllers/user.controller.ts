import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../util/ApiResponse';
import userService from '../services/user.service';
const userController: any = {};

userController.updateProfile = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<ApiResponse | any> => {
  try {
    const apiResponse = await userService.updateProfile(request);
    return response.status(apiResponse.statusCode).send(apiResponse);
  } catch (error: any) {
    console.error('==> userController.updateProfile', error);
    return next(ApiResponse.badRequest(error));
  }
};

userController.changePassword = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<ApiResponse | any> => {
  try {
    const apiResponse = await userService.changePassword(request);
    return response.status(apiResponse.statusCode).send(apiResponse);
  } catch (error: any) {
    console.error('==> userController.changePassword', error);
    return next(ApiResponse.badRequest(error));
  }
};

export default userController;
