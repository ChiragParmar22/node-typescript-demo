import nodemailer from 'nodemailer';
import config from '../../configs/common.config';

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: Number(config.EMAIL_PORT),
    secure: false,
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Uniq Leagues <${config.EMAIL_USERNAME}>`,
    to,
    subject,
    html: text,
  };

  try {
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
