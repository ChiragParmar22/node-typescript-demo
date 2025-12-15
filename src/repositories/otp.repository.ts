import { OtpModel } from '../models/otp/otp.model';
const otpRepository: any = {};

otpRepository.createOtp = async (payload: any) => {
  return await OtpModel.create(payload);
};

otpRepository.updateOtp = async (email: string, otp: number) => {
  return await OtpModel.updateOne({ email }, { otp });
};

otpRepository.findOtpByEmail = async (email: string, role: string) => {
  return await OtpModel.findOne({ email, role });
};

otpRepository.removeOtp = async (email: string, role: string) => {
  return await OtpModel.deleteOne({ email, role });
};

export default otpRepository;
