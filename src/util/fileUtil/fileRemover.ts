import fs from 'fs';
import path from 'path';

export const removeFile = (fileName: string, folder: string): void => {
  const filePath = path.join(__dirname, '../../public', folder, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error removing file: ${filePath}`, err);
      } else {
        console.log(`File removed successfully: ${filePath}`);
      }
    });
  } else {
    console.warn(`File not found for removal: ${filePath}`);
  }
};
