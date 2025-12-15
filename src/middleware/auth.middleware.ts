import { Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import responseMessages from '../constants/messages.constants';
import JwtUtil from '../util/jwt/jwt.util';
import UserRepository from '../repositories/user.repository';

export = async (request: Request, response, next: NextFunction) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token || token == null) {
      return response.status(StatusCodes.UNAUTHORIZED).json({
        data: {},
        message: responseMessages.TOKEN_REQUIRED,
      });
    }

    const decoded: any = await JwtUtil.verifyToken(token);
    if (!decoded || !decoded.userId) {
      return response.status(StatusCodes.UNAUTHORIZED).json({
        data: {},
        message: responseMessages.INVALID_TOKEN,
      });
    }

    const user = await UserRepository.findUserById(decoded.userId);
    if (!user) {
      return response.status(StatusCodes.NOT_FOUND).json({
        data: {},
        message: responseMessages.USER_NOT_FOUND_TOKEN,
      });
    }

    if (user.passwordChangedAt > decoded.iat) {
      return response.status(StatusCodes.UNAUTHORIZED).json({
        data: {},
        message: responseMessages.PASSWORD_CHANGED_TOKEN,
      });
    }

    request['user'] = user;
    request['token'] = token;

    next();
  } catch (error: any) {
    console.log('==========> error', error);

    if (error.name === 'TokenExpiredError') {
      return response.status(StatusCodes.UNAUTHORIZED).json({
        data: {},
        message: responseMessages.TOKEN_EXPIRED,
      });
    }

    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: {},
      message: responseMessages.INTERNAL_SERVER_ERROR,
    });
  }
};
