import jwt from 'jsonwebtoken';
import config from '../../configs/common.config';

export default class JwtUtil {
  static generateToken(payload: any): string {
    return jwt.sign(payload, config.JWT_SECRET as unknown as any, {
      expiresIn: config.JWT_EXPIRES_IN as unknown as any,
    });
  }

  static async verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.JWT_SECRET, (err: any, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }
}
