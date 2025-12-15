import { Request } from 'express';
import ApiResponse from '../util/ApiResponse';
import responseMessages from '../constants/messages.constants';
import JwtUtil from '../util/jwt/jwt.util';
import CommonFunctions from '../util/commonFunctions';
import { removeLocalFile } from '../util/fileUtil/fileUpload';
import {
  registerOtpEmailContent,
  forgotPasswordEmailContent,
} from '../util/email/emailContent';
import { sendEmail } from '../util/email/sendEmail';
import UserRepository from '../repositories/user.repository';
import OtpRepository from '../repositories/otp.repository';
import { SendOtpInterface } from '../models/otp/_interface/otp.interface';
import { OtpDocument } from '../models/otp/otp.model';
import { UserDocument } from '../models/user/user.model';
import { userLoginResponse } from '../models/user/_interface/user.interface';
const authService: any = {};

/**
 * Send OTP to user email
 * @param request
 * @returns
 */
authService.sendOtp = async (request: Request): Promise<ApiResponse | any> => {
  try {
    const body: SendOtpInterface = request.body;

    const existingUser: UserDocument | any =
      await UserRepository.findUserByEmail(body.email, body.role);

    if (existingUser) {
      return ApiResponse.conflict(responseMessages.USER_EXIST);
    }

    const otp: Number = CommonFunctions.generateOtp();

    const existingOtp: OtpDocument | any = await OtpRepository.findOtpByEmail(
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

    const emailContent = registerOtpEmailContent(
      body.name as string,
      otp as number
    );
    await sendEmail(body.email as string, 'Registration email', emailContent);

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
authService.registerUser = async (
  request: Request
): Promise<ApiResponse | any> => {
  const deviceType = request.body.deviceType;
  const profileImage = request.file ? (request.file as any).path : '';
  const profileImagePublicId = request.file
    ? (request.file as any).filename
    : '';
  request.body.profileImage = profileImage;

  try {
    const body = { ...request.body, deviceType };

    const existingUser: UserDocument | any =
      await UserRepository.findUserByEmail(body.email, body.role);
    if (existingUser) {
      removeLocalFile(profileImagePublicId);
      return ApiResponse.conflict(responseMessages.USER_EXIST);
    }

    const existingOtp: OtpDocument | any = await OtpRepository.findOtpByEmail(
      body.email,
      body.role
    );

    if (!existingOtp || existingOtp.otp !== Number(body.otp)) {
      removeLocalFile(profileImagePublicId);
      return ApiResponse.badRequest(responseMessages.INVALID_OTP);
    }

    await OtpRepository.removeOtp(body.email, body.role);

    const userPayload = {
      name: body.name,
      gender: body.gender,
      address: body.address,
      location: {
        type: 'Point',
        coordinates: [body.longitude, body.lattitude],
      },
      phone: body.phone,
      email: body.email.toLowerCase(),
      password: body.password,
      role: body.role,
      profileImage,
      profileImagePublicId,
      deviceType: body.deviceType,
      deviceToken: body.deviceToken,
      loginCount: 1,
      lastLoginDate: new Date(),
    };

    const user: UserDocument | any =
      await UserRepository.createUser(userPayload);

    const token: String = JwtUtil.generateToken({
      userId: user._id.toString(),
      role: body.role,
    });

    const responseData: userLoginResponse = {
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
authService.loginUser = async (
  request: Request
): Promise<ApiResponse | any> => {
  try {
    const deviceType = request.body.deviceType;
    const body = { ...request.body, deviceType };

    const existingUser: UserDocument | null =
      await UserRepository.findUserByEmail(body.email, body.role);
    if (!existingUser) {
      return ApiResponse.notFound(responseMessages.USER_NOT_FOUND_EMAIL);
    }

    const isPasswordValid: boolean = body.password === existingUser.password;

    if (!isPasswordValid) {
      return ApiResponse.unauthorized(responseMessages.INVALID_CREDENTIALS);
    }

    await UserRepository.updateUser(
      { _id: existingUser._id },
      {
        deviceType,
        deviceToken: body.deviceToken,

        loginCount: Number(existingUser.loginCount) + 1,
        lastLoginDate: new Date(),
      }
    );

    const token: string = JwtUtil.generateToken({
      userId: existingUser._id.toString(),
      role: body.role,
    });

    const responseData: userLoginResponse = {
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
authService.sendForgotPasswordOtp = async (
  request: Request
): Promise<ApiResponse | any> => {
  try {
    const body = request.body;

    const existingUser: UserDocument | null =
      await UserRepository.findUserByEmail(body.email, body.role);
    if (!existingUser) {
      return ApiResponse.notFound(responseMessages.USER_NOT_FOUND_EMAIL);
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
        name: existingUser.name,
        otp,
        role: body.role,
      });
    }

    const emailContent = forgotPasswordEmailContent(
      existingUser.name as string,
      otp as number
    );
    await sendEmail(
      body.email as string,
      'Forgot password email',
      emailContent
    );

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
authService.resetPassword = async (
  request: Request
): Promise<ApiResponse | any> => {
  try {
    const body = request.body;

    const existingUser: UserDocument | any =
      await UserRepository.findUserByEmail(body.email, body.role);
    if (!existingUser) {
      return ApiResponse.notFound(responseMessages.USER_NOT_FOUND_EMAIL);
    }

    const existingOtp: OtpDocument | any = await OtpRepository.findOtpByEmail(
      body.email,
      body.role
    );

    if (!existingOtp || existingOtp.otp !== Number(body.otp)) {
      return ApiResponse.badRequest(responseMessages.INVALID_OTP);
    }

    const isOldPasswordSame: Boolean = body.password === existingUser.password;
    if (isOldPasswordSame) {
      return ApiResponse.badRequest(responseMessages.NEW_PASSWORD_SAME);
    }

    await OtpRepository.removeOtp(body.email, body.role);

    await UserRepository.updateUser(
      { _id: existingUser._id },
      {
        password: body.newPassword,
        passwordChangedAt: Math.floor(Date.now() / 1000),
      }
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
authService.refreshToken = async (
  request: Request
): Promise<ApiResponse | any> => {
  try {
    const { userId } = request.body;
    const user: UserDocument | any = await UserRepository.findUserById(
      userId as string
    );
    if (!user) {
      return ApiResponse.notFound(responseMessages.USER_NOT_FOUND_TOKEN);
    }

    const newToken: String = JwtUtil.generateToken({
      userId: userId,
    });

    return ApiResponse.success(
      {
        token: newToken,
      },
      responseMessages.TOKEN_REFRESHED_SUCCESS
    );
  } catch (error: any) {
    console.error('==> authService.refreshToken', error);

    return ApiResponse.badRequest(responseMessages.INTERNAL_SERVER_ERROR);
  }
};

export default authService;
