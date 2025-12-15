import { ROLES } from '../constants/key.constants';
import { OtpDocument, OtpModel } from '../models/otp/otp.model';
const otpRepository: any = {};

otpRepository.createOtp = async (payload: any) => {
  return await OtpModel.create(payload);
};

otpRepository.updateOtp = async (email: String, otp: Number) => {
  return await OtpModel.updateOne({ email }, { otp });
};

otpRepository.findOtpByEmail = async (
  email: string,
  role: ROLES
): Promise<OtpDocument | null> => {
  return await OtpModel.findOne({ email, role });
};

otpRepository.removeOtp = async (email: string, role: string) => {
  return await OtpModel.deleteOne({ email, role });
};

export default otpRepository;
