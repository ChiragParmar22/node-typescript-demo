import mongoose, { Model, Schema, Document } from 'mongoose';
import config from '../../configs/common.config';

export interface AppVersionDocument extends Document {
  versionCode: string;
  deviceType: string;
  createdAt: Date;
  deletedAt: Date;
}

const appVersionSchema = new Schema<AppVersionDocument>(
  {
    versionCode: { type: String },
    deviceType: { type: String },
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
  },
  { collection: 'appVersion' }
);

appVersionSchema.statics.seedData = async function () {
  const sampleData = config.VERSION_DATA;
  try {
    const chkData = await this.find();
    if (chkData.length === 0) {
      const insertedData = await this.insertMany(sampleData);
      console.log('App version data seeded successfully:', insertedData);
    }
  } catch (error) {
    console.error('Error seeding app version data:', error);
  }
};

const AppVersionModel: Model<AppVersionDocument> =
  mongoose.model<AppVersionDocument>('appVersion', appVersionSchema);

export default AppVersionModel;
