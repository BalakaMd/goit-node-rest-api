import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import { nanoid } from 'nanoid';
import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';
import { sendVerificationEmail } from '../helpers/sendEmail.js';

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
    
    // Generate avatar URL using gravatar
    const avatarURL = `https:${gravatar.url(email, { s: '250', d: 'identicon', r: 'pg' })}`;
    
    // Generate verification token
    const verificationToken = nanoid();
    
    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken
    });
    
    // Send verification email
    await sendVerificationEmail(email, verificationToken);
    
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL
      },
      message: "Verification email has been sent to your email address"
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
    
    // Check if email is verified
    if (!user.verify) {
      return next(HttpError(401, "Email not verified. Please check your email for verification link"));
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
        subscription: user.subscription,
        avatarURL: user.avatarURL
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { user } = req;
    
    user.token = null;
    await user.save();
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const { user } = req;
    
    res.json({
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    
    const user = await User.findOne({ where: { verificationToken } });
    if (!user) {
      return next(HttpError(404, "User not found or already verified"));
    }
    
    user.verify = true;
    user.verificationToken = null;
    await user.save();
    
    res.status(200).json({
      message: "Verification successful"
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Check if email is provided
    if (!email) {
      return next(HttpError(400, "missing required field email"));
    }
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(HttpError(404, "User not found"));
    }
    
    // Check if user is already verified
    if (user.verify) {
      return res.status(400).json({
        message: "Verification has already been passed"
      });
    }
    
    // If user is not verified, generate a new verification token if needed
    if (!user.verificationToken) {
      user.verificationToken = nanoid();
      await user.save();
    }
    
    // Send verification email
    await sendVerificationEmail(email, user.verificationToken);
    
    res.status(200).json({
      message: "Verification email sent"
    });
  } catch (error) {
    next(error);
  }
};
