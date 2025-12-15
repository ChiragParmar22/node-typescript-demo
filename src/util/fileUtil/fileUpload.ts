import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure public folder exists
const uploadDir = path.join(process.cwd(), 'src', 'public');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === 'profileImage') {
      const profileFolder = path.join(uploadDir, 'profileImages');
      if (!fs.existsSync(profileFolder)) {
        fs.mkdirSync(profileFolder, { recursive: true });
      }
      cb(null, profileFolder);
    } else {
      cb(new Error('Invalid field name for file upload'), '');
    }
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${Date.now()}${ext}`);
  },
});

export const upload = multer({ storage });

export const removeLocalFile = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Error removing local file: ${error}`);
  }
};
