import crypto from 'crypto';
require('dotenv').config();

const encryptDecrypt = (action, string) => {
  let output: string | null = null;
  const encryptMethod = 'aes-256-cbc';
  const secretKey = process.env.ENC_SECRET_KEY;
  const secretIv = process.env.ENC_SECRET_IV;

  const key = crypto
    .createHash('sha256')
    .update(secretKey)
    .digest('base64')
    .substr(0, 32);

  const iv = crypto
    .createHash('sha256')
    .update(secretIv)
    .digest('base64')
    .substr(0, 16);

  if (action === 'encrypt') {
    const cipher = crypto.createCipheriv(encryptMethod, key, iv);
    let encrypted = cipher.update(string, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    output = encrypted;
  } else if (action === 'decrypt') {
    const decipher = crypto.createDecipheriv(encryptMethod, key, iv);
    let decrypted = decipher.update(string, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    output = decrypted;
  }

  if (!output) {
    output = string;
  }

  return output;
};

module.exports = encryptDecrypt;
