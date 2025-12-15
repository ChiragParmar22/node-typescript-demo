import bctyptjs from 'bcryptjs';

export default class BcryptjsUtil {
  static async hashPassword(password: string): Promise<any> {
    const salt = await bctyptjs.genSalt(10);
    const hashedPassword = await bctyptjs.hash(password, salt);

    return { hashedPassword, salt };
  }

  static async comparePassword(
    password: string,
    hashedPassword: string,
    salt: string
  ): Promise<boolean> {
    const hash = await bctyptjs.hash(password, salt);
    return hash === hashedPassword;
  }
}
