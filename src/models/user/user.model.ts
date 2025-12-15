import mongoose, { Model, Schema, Document } from 'mongoose';
import {
  GENDER,
  DEVICE_TYPE,
  ROLES,
  USER_STATUS,
  LocationData,
} from '../../constants/key.constants';

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  gender: GENDER;
  address: string;
  location: LocationData;
  profileImage: string;
  profileImagePublicId: string;
  phone: number;
  email: string;
  salt: string;
  hashedPassword: string;
  role: ROLES;
  status: USER_STATUS;
  passwordChangedAt: number;
  lastLoginDate: Date;
  loginCount: number;
  deviceType: DEVICE_TYPE;
  deviceToken: string;
  isActive: Boolean;
  isDeleted: Boolean;
  deletedReason: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const userSchema: Schema<UserDocument> = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: GENDER,
    },
    address: {
      type: String,
      default: null,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: [Number],
    },
    profileImage: {
      type: String,
      required: false,
      default: null,
    },
    profileImagePublicId: {
      type: String,
      required: false,
      default: null,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    salt: {
      type: String,
      required: false,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ROLES,
      default: ROLES.USER,
    },
    status: {
      type: String,
      required: true,
      enum: USER_STATUS,
      default: USER_STATUS.ACTIVE,
    },
    passwordChangedAt: {
      type: Number,
      required: false,
    },
    lastLoginDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    loginCount: {
      type: Number,
      required: true,
      default: 0,
    },
    deviceType: {
      type: String,
      required: false,
      enum: DEVICE_TYPE,
      default: null,
    },
    deviceToken: {
      type: String,
      required: false,
      default: null,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedReason: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      required: true,
      default: new Date(),
    },
    updatedAt: {
      type: Date,
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  { versionKey: false }
);

userSchema.index({ location: '2dsphere' });

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>(
  'user',
  userSchema
);
