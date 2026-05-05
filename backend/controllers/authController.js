import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, college, branch, graduationYear } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !college ||
      !branch ||
      !graduationYear
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_FIELDS",
          message: "Please provide all required fields",
          statusCode: 400,
        },
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: {
          code: "WEAK_PASSWORD",
          message: "Password must be at least 8 characters",
          statusCode: 400,
        },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: "EMAIL_EXISTS",
          message: "Email already registered",
          statusCode: 409,
        },
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      passwordHash: password,
      college,
      branch,
      graduationYear: parseInt(graduationYear),
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "REGISTER_FAILED",
        message: error.message || "Registration failed",
        statusCode: 500,
      },
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_CREDENTIALS",
          message: "Please provide email and password",
          statusCode: 400,
        },
      });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
          statusCode: 401,
        },
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
          statusCode: 401,
        },
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "LOGIN_FAILED",
        message: error.message || "Login failed",
        statusCode: 500,
      },
    });
  }
};
