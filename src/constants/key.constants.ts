export enum ENVIRONMENT {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
}

export enum DEVICE_TYPE {
  ANDROID = 'android',
  IOS = 'ios',
}

export enum ROLES {
  ADMIN = 'admin',
  SERVICE_PROVIDER = 'serviceProvider',
  USER = 'user',
}

export enum USER_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export interface LocationData {
  type: string;
  coordinates: number[];
}

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'noShow',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum CancelledBy {
  USER = 'user',
  SERVICE_PROVIDER = 'serviceProvider',
}
