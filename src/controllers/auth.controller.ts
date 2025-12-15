import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../util/ApiResponse';
import userService from '../services/auth.service';
const authController: any = {};

authController.sendOtp = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const apiResponse = await userService.sendOtp(request);
    return response.status(apiResponse.statusCode).send(apiResponse);
  } catch (error: any) {
    console.error('==> authController.sendOtp', error);
    return next(ApiResponse.badRequest(error));
  }
};

authController.registerUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const apiResponse = userService.registerUser(request);
    return response.status(apiResponse.statusCode).send(apiResponse);
  } catch (error: any) {
    console.error('==> authController.registerUser', error);
    return next(ApiResponse.badRequest(error));
  }
};

authController.loginUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const apiResponse = userService.loginUser(request);
    return response.status(apiResponse.statusCode).send(apiResponse);
  } catch (error: any) {
    console.error('==> authController.loginUser', error);
    return next(ApiResponse.badRequest(error));
  }
};

authController.sendForgotPasswordOtp = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const apiResponse = userService.sendForgotPasswordOtp(request);
    return response.status(apiResponse.statusCode).send(apiResponse);
  } catch (error: any) {
    console.error('==> authController.sendForgotPasswordOtp', error);
    return next(ApiResponse.badRequest(error));
  }
};

authController.resetPassword = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const apiResponse = userService.resetPassword(request);
    return response.status(apiResponse.statusCode).send(apiResponse);
  } catch (error: any) {
    console.error('==> authController.resetPassword', error);
    return next(ApiResponse.badRequest(error));
  }
};

export default authController;
