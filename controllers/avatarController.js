import fs from 'fs-extra';
import path from 'path';
import HttpError from '../helpers/HttpError.js';

export const updateAvatar = async (req, res, next) => {
  try {
    const { user } = req;
    
    if (!req.file) {
      return next(HttpError(400, "Avatar file is required"));
    }
    
    // Define paths
    const { path: tempUpload, filename } = req.file;
    const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
    const newFilename = `${user.id}${path.extname(filename)}`;
    const newUpload = path.join(avatarsDir, newFilename);
    
    // Move file from temp to public/avatars
    await fs.move(tempUpload, newUpload, { overwrite: true });
    
    // Update user's avatarURL in the database
    const avatarURL = `/avatars/${newFilename}`;
    user.avatarURL = avatarURL;
    await user.save();
    
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
