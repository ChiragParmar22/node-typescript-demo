import { Request } from 'express';
import ApiResponse from '../util/ApiResponse';
import responseMessages from '../constants/messages.constants';
import BcryptjsUtil from '../util/bcryptjs/bcryptjs.util';
import JwtUtil from '../util/jwt/jwt.util';
import CommonFunctions from '../util/commonFunctions';
import { removeLocalFile } from '../util/fileUtil/fileUpload';
// import {
//   registerOtpEmailContent,
//   forgotPasswordEmailContent,
// } from '../util/email/emailContent';
// import { sendEmail } from '../util/email/sendEmail';
import UserRepository from '../repositories/user.repository';
import OtpRepository from '../repositories/otp.repository';
import { SendOtpInterface } from '../models/otp/_interface/otp.interface';
import { UserDocument } from '../models/user/user.model';
import { OtpDocument } from '../models/otp/otp.model';
const authService: any = {};

/**
 * Send OTP to user email
 * @param request
 * @returns
 */
authService.sendOtp = async (request: Request): Promise<ApiResponse | any> => {
  try {
    const body: SendOtpInterface = request.body;

    const existingUser: UserDocument | null =
      await UserRepository.findUserByEmail(body.email, body.role);
    if (existingUser) {
      return ApiResponse.conflict(responseMessages.USER_EXIST);
    }

    const otp: Number = CommonFunctions.generateOtp();

    const existingOtp: OtpDocument | null = await OtpRepository.findOtpByEmail(
      body.email,
      body.role
    );
    if (existingOtp) {
      await OtpRepository.updateOtp(body.email, otp);
    } else {
      await OtpRepository.createOtp({
        email: body.email,
        name: body.name,
        otp,
        role: body.role,
      });
    }

    // const emailContent = registerOtpEmailContent(body.name, otp);
    // await sendEmail(body.email, 'Registration email', emailContent);

    return ApiResponse.success({}, responseMessages.REGISTRATION_OTP_SENT);
  } catch (error) {
    throw error;
  }
};

/**
 * Register user
 * @param request
 * @returns
 */
authService.registerUser = async (request: Request) => {
  const deviceType = request.body.deviceType;
  const profileImage = request.file ? (request.file as any).path : '';
  const profileImagePublicId = request.file
    ? (request.file as any).filename
    : '';
  request.body.profileImage = profileImage;

  try {
    const body = { ...request.body, deviceType };

    const existingUser = await UserRepository.findUserByEmail(
      body.email,
      body.role
    );
    if (existingUser) {
      removeLocalFile(profileImagePublicId);
      return ApiResponse.conflict(responseMessages.USER_EXIST);
    }

    const existingOtp = await OtpRepository.findOtpByEmail(
      body.email,
      body.role
    );
    if (!existingOtp || existingOtp.otp !== body.otp) {
      removeLocalFile(profileImagePublicId);
      return ApiResponse.badRequest(responseMessages.INVALID_OTP);
    }

    await OtpRepository.removeOtp(body.email, body.role);

    const { hashedPassword, salt } = await BcryptjsUtil.hashPassword(
      body.password
    );

    const userPaylod = {
      name: body.name,
      gender: body.gender,
      address: body.address,
      location: {
        type: 'Point',
        coordinates: [body.longitude, body.lattitude],
      },
      phone: body.phone,
      email: body.email.toLowerCase(),
      salt,
      hashedPassword,
      role: body.role,
      profileImage,
      profileImagePublicId,
      deviceType: body.deviceType,
      deviceToken: body.deviceToken,
      loginCount: 1,
      lastLoginDate: new Date(),
    };

    const user = await UserRepository.createUser(userPaylod);
    const token = JwtUtil.generateToken({
      userId: user._id.toString(),
      role: body.role,
    });

    const responseData = {
      _id: user._id,
      name: user.name,
      gender: user.gender,
      address: user.address,
      location: user.location,
      phone: user.phone,
      email: user.email,
      profileImage,
      token,
      role: user.role,
    };

    return ApiResponse.success(
      responseData,
      responseMessages.REGISTRATION_SUCCESS
    );
  } catch (error: any) {
    throw error;
  }
};

/**
 * Login user
 * @param request
 * @returns
 */
authService.loginUser = async (request: Request) => {
  try {
    const deviceType = request.body.deviceType;
    const body = { ...request.body, deviceType };

    const existingUser = await UserRepository.findUserByEmail(
      body.email,
      body.role
    );
    if (!existingUser) {
      return ApiResponse.notFound(responseMessages.USER_NOT_FOUND_EMAIL);
    }

    const isPasswordValid = await BcryptjsUtil.comparePassword(
      body.password,
      existingUser.hashedPassword,
      existingUser.salt
    );
    if (!isPasswordValid) {
      return ApiResponse.unauthorized(responseMessages.INVALID_CREDENTIALS);
    }

    await UserRepository.updateUser(
      { _id: existingUser._id },
      {
        deviceType,
        deviceToken: body.deviceToken,
        loginCount: existingUser.loginCount + 1,
        lastLoginDate: new Date(),
      }
    );

    const token = JwtUtil.generateToken({
      userId: existingUser._id.toString(),
      role: body.role,
    });

    const responseData = {
      _id: existingUser._id,
      name: existingUser.name,
      gender: existingUser.gender,
      address: existingUser.address,
      location: existingUser.location,
      phone: existingUser.phone,
      email: existingUser.email,
      profileImage: existingUser.profileImage,
      token,
      role: existingUser.role,
    };

    return ApiResponse.success(responseData, responseMessages.LOGIN_SUCCESS);
  } catch (error) {
    throw error;
  }
};

/**
 * Send OTP for forgot password
 * @param request
 * @returns
 */
authService.sendForgotPasswordOtp = async (request: Request) => {
  try {
    const body = request.body;

    const existingUser = await UserRepository.findUserByEmail(
      body.email,
      body.role
    );
    if (!existingUser) {
      return ApiResponse.notFound(responseMessages.USER_NOT_FOUND_EMAIL);
    }

    const otp = CommonFunctions.generateOtp();

    const existingOtp = await OtpRepository.findOtpByEmail(
      body.email,
      body.role
    );
    if (existingOtp) {
      await OtpRepository.updateOtp(body.email, otp);
    } else {
      await OtpRepository.createOtp({
        email: body.email,
        name: existingUser.name,
        otp,
        role: body.role,
      });
    }

    // const emailContent = forgotPasswordEmailContent(existingUser.name, otp);
    // await sendEmail(body.email, 'Forgot password email', emailContent);

    return ApiResponse.success({}, responseMessages.FORGOT_PASSWORD_OTP_SENT);
  } catch (error) {
    throw error;
  }
};

/**
 * Reset user password
 * @param request
 * @returns
 */
authService.resetPassword = async (request: Request) => {
  try {
    const body = request.body;

    const existingUser = await UserRepository.findUserByEmail(
      body.email,
      body.role
    );
    if (!existingUser) {
      return ApiResponse.notFound(responseMessages.USER_NOT_FOUND_EMAIL);
    }

    const existingOtp = await OtpRepository.findOtpByEmail(
      body.email,
      body.role
    );
    if (!existingOtp || existingOtp.otp !== body.otp) {
      return ApiResponse.badRequest(responseMessages.INVALID_OTP);
    }

    const isOldPasswordSame = await BcryptjsUtil.comparePassword(
      body.password,
      existingUser.hashedPassword,
      existingUser.salt
    );
    if (isOldPasswordSame) {
      return ApiResponse.badRequest(responseMessages.NEW_PASSWORD_SAME);
    }

    await OtpRepository.removeOtp(body.email, body.role);

    const { hashedPassword, salt } = await BcryptjsUtil.hashPassword(
      body.password
    );
    await UserRepository.updateUser(
      { _id: existingUser._id },
      { hashedPassword, salt }
    );

    return ApiResponse.success(responseMessages.PASSWORD_RESET_SUCCESS);
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh user token
 * @param request
 * @param response
 * @returns
 */
//  authService.refreshToken=async(request: Request, response: Response) =>{
//   const token = request.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return response.status(StatusCodes.UNAUTHORIZED).json({
//       data: {},
//       message: responseMessages.REFRESH_TOKEN_REQUIRED,
//     });
//   }

//   try {
//     const decoded = await JwtUtil.verifyRefreshToken(token);
//     if (!decoded || !decoded.userId) {
//       return response.status(StatusCodes.UNAUTHORIZED).json({
//         data: {},
//         message: responseMessages.INVALID_REFRESH_TOKEN,
//       });
//     }

//     const user = await UserRepository.findUserByEmail(
//       decoded.userId,
//       decoded.role
//     );
//     if (!user) {
//       return response.status(StatusCodes.NOT_FOUND).json({
//         data: {},
//         message: responseMessages.USER_NOT_FOUND_TOKEN,
//       });
//     }

//     if (user.passwordChangedAt < decoded.iat) {
//       return response.status(StatusCodes.UNAUTHORIZED).json({
//         data: {},
//         message: responseMessages.PASSWORD_CHANGED_TOKEN,
//       });
//     }

//     const newToken = JwtUtil.generateToken({
//       userId: decoded.userId,
//       role: decoded.role,
//     });
//     const newRefreshToken = JwtUtil.generateRefreshToken({
//       userId: decoded.userId,
//       role: decoded.role,
//     });

//     return response.status(StatusCodes.OK).json({
//       data: {
//         token: newToken,
//         refreshToken: newRefreshToken,
//       },
//       message: responseMessages.TOKEN_REFRESHED,
//     });
//   } catch (error: any) {
//     console.log('==========> error', error);

//     if (error.name === 'TokenExpiredError') {
//       return response.status(StatusCodes.UNAUTHORIZED).json({
//         data: {},
//         message: responseMessages.REFRESH_TOKEN_EXPIRED,
//       });
//     }

//     return response.status(StatusCodes.UNAUTHORIZED).json({
//       data: {},
//       message: responseMessages.INTERNAL_SERVER_ERROR,
//     });
//   }
// }

export default authService;
