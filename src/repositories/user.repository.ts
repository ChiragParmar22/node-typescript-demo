import { UserDocument, UserModel } from '../models/user/user.model';
const userRepository: any = {};

userRepository.createUser = async (
  payload: any
): Promise<UserDocument | any> => {
  return await UserModel.create(payload);
};

userRepository.findUserById = async (id: string) => {
  return await UserModel.findOne({
    _id: id,
    isActive: true,
    isDeleted: false,
  }).select('-password -__v -deletedAt');
};

userRepository.findUserByEmail = async (email: string, role: string) => {
  return await UserModel.findOne({
    email,
    role,
    isActive: true,
    isDeleted: false,
  });
};

userRepository.updateUser = async (filter: any, payload: any) => {
  return await UserModel.findOneAndUpdate(filter, payload, { new: true });
};

export default userRepository;
