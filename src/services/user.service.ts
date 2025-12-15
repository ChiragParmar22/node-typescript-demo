import { Request } from 'express';
import ApiResponse from '../util/ApiResponse';
import responseMessages from '../constants/messages.constants';
import BcryptjsUtil from '../util/bcryptjs/bcryptjs.util';
import JwtUtil from '../util/jwt/jwt.util';
import { removeLocalFile } from '../util/fileUtil/fileUpload';
import UserRepository from '../repositories/user.repository';
const userService: any = {};

/**
 * Update user profile
 * @param request
 * @returns
 */
userService.updateProfile = async (request: Request) => {
  const token = request.headers.authorization?.split(' ')[1];
  let profileImage = request.file ? (request.file as any).path : '';
  let profileImagePublicId = request.file ? (request.file as any).filename : '';

  try {
    const body = { ...request.body, profileImage };

    if (profileImage && request['user'].profileImagePublicId) {
      await removeLocalFile(request['user'].profileImagePublicId);
    }

    if (!profileImage) {
      profileImage = request['user'].profileImage;
      profileImagePublicId = request['user'].profileImagePublicId;
    }

    const userUpdatePaylod = {
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

    const updatedUser = await UserRepository.updateUser(
      { _id: request['user']._id },
      userUpdatePaylod
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
  } catch (error) {
    throw error;
  }
};

/**
 * Change user password
 * @param request
 * @returns
 */
userService.changePassword = async (request: Request) => {
  try {
    const body = request.body;
    const user = request['user'];

    const isOldPasswordSame = await BcryptjsUtil.comparePassword(
      body.oldPassword,
      user.hashedPassword,
      user.salt
    );
    if (!isOldPasswordSame) {
      return ApiResponse.badRequest(
        {},
        responseMessages.INCORRECT_CURRENT_PASSWORD
      );
    }

    const { hashedPassword, salt } = await BcryptjsUtil.hashPassword(
      body.newPassword
    );
    const updatedUser = await UserRepository.updateUser(
      { _id: user._id },
      { hashedPassword, salt, passwordChangedAt: Date.now() }
    );

    const token = JwtUtil.generateToken({
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
