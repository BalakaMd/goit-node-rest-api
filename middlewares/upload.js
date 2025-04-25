import multer from 'multer';
import path from 'path';

const tempDir = path.join(process.cwd(), 'temp');

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniquePrefix + path.extname(file.originalname);
    cb(null, filename);
  }
});

const upload = multer({
  storage: multerConfig,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

export default upload;
