import { DEVICE_TYPE } from '../constants/key.constants';

export default {
  APP_NAME: process.env.APP_NAME,

  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DEVELOPER_NAME: process.env.DEVELOPER_NAME,

  TIMEZONE: process.env.TIMEZONE,

  APP_URL: process.env.APP_URL,
  CLIENT_URL: process.env.CLIENT_URL,

  MONGODB_URL: process.env.MONGODB_URL,
  MONGODB_DATABASE_NAME: process.env.MONGODB_DATABASE_NAME,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  RATE_LIMIT_MINUTES: process.env.RATE_LIMIT_MINUTES,
  RATE_LIMIT_REQUEST_PER_MINUTES: process.env.RATE_LIMIT_REQUEST_PER_MINUTES,

  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

  loggerDateFormat: 'YYYY-MM-DD HH:mm:ss',
  version: '1.0.0',

  VERSION_DATA: [
    {
      versionCode: '1',
      deviceType: DEVICE_TYPE.ANDROID,
    },
    {
      versionCode: '1',
      deviceType: DEVICE_TYPE.IOS,
    },
  ],
};
