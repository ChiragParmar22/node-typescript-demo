import { GENDER, LocationData, ROLES } from '../../../constants/key.constants';
import mongoose from 'mongoose';

export interface userLoginResponse {
  name: String;
  gender: GENDER;
  address: String;
  location: LocationData;
  phone: Number;
  email: String;
  profileImage: String;
  token: String;
  role: ROLES;
  _id: mongoose.Types.ObjectId;
}
