import { ROLES } from '../constants/key.constants';
import { OtpDocument, OtpModel } from '../models/otp/otp.model';
const otpRepository: any = {};

otpRepository.createOtp = async (payload: any): Promise<OtpDocument | any> => {
  return await OtpModel.create(payload);
};

otpRepository.updateOtp = async (
  email: String,
  otp: Number
): Promise<OtpDocument | any> => {
  return await OtpModel.updateOne({ email }, { otp });
};

otpRepository.findOtpByEmail = async (
  email: String,
  role: ROLES
): Promise<OtpDocument | any> => {
  return await OtpModel.findOne({ email, role });
};

otpRepository.removeOtp = async (
  email: String,
  role: String
): Promise<void | any> => {
  return await OtpModel.deleteOne({ email, role });
};

export default otpRepository;
