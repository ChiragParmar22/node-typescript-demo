import { ROLES } from '../../../constants/key.constants';

export interface SendOtpInterface {
  email: string;
  name: string;
  role: ROLES;
}
