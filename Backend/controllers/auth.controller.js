import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";


const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export async function Register(req, res) {
  try {
    const { name, email, password, role, bio, hourlyRate } = req.validatedData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      ...(bio && { bio }),
      ...(hourlyRate && role === 'mentor' && { hourlyRate })
    });

    if (user) {      
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        ...(user.hourlyRate && { hourlyRate: user.hourlyRate }),
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data"
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function Login(req, res) {
  try {
    const { email, password } = req.validatedData;
    const normalizedEmail = email.toLowerCase().trim();

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i') } 
    }).select('+password');

    if (!user) {
      console.log("User not found for email:", normalizedEmail);
      return res.status(401).json({"success":false,"message":"Invalid email or password"});
    }

    if (typeof user.password !== 'string' || user.password.length === 0) {
      console.error("Password hash not returned for user:", user._id);
      return res.status(500).json({"success":false,"message":"Server misconfiguration: password not retrievable"});
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({"success":false,"message":"Invalid email or password"});
    }

    const token = generateToken(user._id, user.role);
    const { password: _, ...userData } = user.toObject();
    
    return res.status(200).json({
      success: true,
      ...userData,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({"success":false,"message":"Server error during login", "error": env.NODE_ENV === 'development' ? error.message : undefined});
  }
}

export function Logout(req, res) {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
}