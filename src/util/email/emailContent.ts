export const registerOtpEmailContent = (name: string, otp: number) => {
  return `
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>CrickBook App OTP</title>
    </head>

    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1a73e8; text-align: center;">CrickBook App</h2>
            <p>Hi <b>${name}</b>,</p>
            <p>Thank you for registering with <b>CrickBook App</b>! To complete your registration, please use the OTP below:</p>

            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; background: #1a73e8; color: #fff; padding: 10px 20px; font-size: 20px; border-radius: 6px; letter-spacing: 4px;">
                    ${otp}
                </span>
            </div>

            <p>This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>
            <p>If you did not request this, you can safely ignore this email.</p>

            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">
                © 2025 CrickBook App. All rights reserved.
            </p>
        </div>
    </body>

    </html>`;
};

export const forgotPasswordEmailContent = (name: string, otp: number) => {
  return `
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>Forgot Password OTP</title>
    </head>

    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #d93025; text-align: center;">Password Reset Request</h2>
            <p>Hi <b>${name}</b>,</p>
            <p>We received a request to reset your password for your <b>CrickBook App</b> account.</p>
            <p>Please use the OTP below to proceed with resetting your password:</p>

            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; background: #d93025; color: #fff; padding: 10px 20px; font-size: 20px; border-radius: 6px; letter-spacing: 4px;">
                    ${otp}
                </span>
            </div>

            <p>This OTP is valid for <b>10 minutes</b>. Do not share it with anyone for security reasons.</p>
            <p>If you did not request a password reset, you can safely ignore this email and your account will remain secure.</p>

            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">
                © 2025 CrickBook App. All rights reserved.
            </p>
        </div>
    </body>

    </html>`;
};
