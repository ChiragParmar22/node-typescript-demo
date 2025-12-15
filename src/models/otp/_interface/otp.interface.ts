import { ROLES } from '../../../constants/key.constants';

export interface SendOtpInterface {
  email: String;
  name: String;
  role: ROLES;
}
