import express from 'express';
import { register, login, logout, current } from '../controllers/authController.js';
import { updateAvatar } from '../controllers/avatarController.js';
import validateBody from '../helpers/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/userSchema.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(loginSchema), login);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/current', authenticate, current);
authRouter.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);

export default authRouter;
