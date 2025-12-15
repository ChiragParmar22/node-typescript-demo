import { Request } from 'express';
import ApiResponse from '../util/ApiResponse';
import responseMessages from '../constants/messages.constants';
import JwtUtil from '../util/jwt/jwt.util';
import { removeLocalFile } from '../util/fileUtil/fileUpload';
import UserRepository from '../repositories/user.repository';
import { UserDocument } from '../models/user/user.model';
const userService: Record<string, any> = {};

/**
 * Update user profile
 * @param request
 * @returns
 */
userService.updateProfile = async (
  request: any
): Promise<ApiResponse | any> => {
  const token: String = request.token;
  let profileImage: String = request.file ? (request.file as any).path : '';
  let profileImagePublicId: String = request.file
    ? (request.file as any).filename
    : '';

  try {
    const body: any = { ...request.body, profileImage };

    if (profileImage && request['user'].profileImagePublicId) {
      await removeLocalFile(request['user'].profileImagePublicId);
    }

    if (!profileImage) {
      profileImage = request['user'].profileImage;
      profileImagePublicId = request['user'].profileImagePublicId;
    }

    const userUpdatePayload = {
      name: body.name,
      gender: body.gender,
      address: body.address,
      location: {
        type: 'Point',
        coordinates: [body.longitude, body.lattitude],
      },
      profileImage,
      profileImagePublicId,
    };

    const updatedUser: UserDocument | any = await UserRepository.updateUser(
      { _id: request['user']._id },
      userUpdatePayload
    );

    const responseData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      gender: updatedUser.gender,
      address: updatedUser.address,
      location: updatedUser.location,
      phone: updatedUser.phone,
      email: updatedUser.email,
      profileImage,
      token,
    };

    return ApiResponse.success(responseData, responseMessages.PROFILE_UPDATE);
  } catch (error: any) {
    console.error('==> userService.updateProfile', error);
    throw error;
  }
};

/**
 * Change user password
 * @param request
 * @returns
 */
userService.changePassword = async (
  request: Request
): Promise<ApiResponse | any> => {
  try {
    const body: any = request.body;
    const user: UserDocument | any = request['user'];

    const isOldPasswordSame: boolean = body.currentPassword === user.password;
    if (!isOldPasswordSame) {
      return ApiResponse.badRequest(
        {},
        responseMessages.INCORRECT_CURRENT_PASSWORD
      );
    }

    const updatedUser: UserDocument | any = await UserRepository.updateUser(
      { _id: user._id },
      {
        password: body.newPassword,
        passwordChangedAt: Math.floor(Date.now() / 1000),
      }
    );

    const token: String = JwtUtil.generateToken({
      userId: updatedUser._id.toString(),
      role: updatedUser.role,
    });

    const responseData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      gender: updatedUser.gender,
      address: updatedUser.address,
      location: updatedUser.location,
      phone: updatedUser.phone,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      token,
    };

    return ApiResponse.success(
      responseData,
      responseMessages.PASSWORD_CHANGE_SUCCESS
    );
  } catch (error) {
    throw error;
  }
};

export default userService;
