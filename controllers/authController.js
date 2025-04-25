import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-jwt-key';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(HttpError(409, "Email in use"));
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword
    });
    
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(HttpError(401, "Email or password is wrong"));
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(HttpError(401, "Email or password is wrong"));
    }
    
    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    user.token = token;
    await user.save();
    
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    next(error);
  }
};
