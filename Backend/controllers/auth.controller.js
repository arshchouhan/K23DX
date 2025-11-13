import zod from "zod";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const registerSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  role: zod.enum(["mentor", "student"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be either 'mentor' or 'student'"
  }),
  email: zod.email("Please provide a valid email"),
  password: zod.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
  bio: zod.string().optional(),
  hourlyRate: zod.number().min(0).optional()
});

const loginSchema = zod.object({
  email: zod.email("Please provide a valid email"),
  password: zod.string().min(1, "Password is required")
});


const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '30d' }
  );
};

export async function Register(req, res) {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    const { name, email, password, role, bio, hourlyRate } = validation.data;

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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function Login(req, res) {
  try {
    
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("Validation failed:", validation.error);
      return res.status(400).json({"success":false,"message":"Validation failed"});
    }

    const { email, password } = validation.data;
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
    return res.status(500).json({"success":false,"message":"Server error during login", "error": process.env.NODE_ENV === 'development' ? error.message : undefined});
  }
}

export function Logout(req, res) {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
}