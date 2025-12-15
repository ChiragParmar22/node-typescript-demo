export default class CommonFunctions {
  static generateOtp(length = 4) {
    const digits = '123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return Number(otp);
  }
}
