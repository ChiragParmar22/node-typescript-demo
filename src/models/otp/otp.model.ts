import mongoose, { Model, Schema, Document } from 'mongoose';
import { ROLES } from '../../constants/key.constants';

export interface OtpDocument extends Document {
  email: string;
  name: string;
  otp: number;
  role: ROLES;
  createdAt: Date;
}

const otpSchema: Schema<OtpDocument> = new Schema<OtpDocument>(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ROLES,
      default: ROLES.USER,
    },
    createdAt: {
      type: Date,
      required: true,
      default: new Date(),
    },
  },
  { versionKey: false }
);

export const OtpModel: Model<OtpDocument> = mongoose.model<OtpDocument>(
  'otp',
  otpSchema
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });
