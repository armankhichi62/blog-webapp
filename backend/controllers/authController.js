const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "author",
    });

    res.status(201).json({
      success: true,
      message: "Author registered successfully",
      data: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

const authenticateUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return null;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return null;
  }

  return user;
};

exports.authorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.role !== "author") {
      return res.status(403).json({
        success: false,
        message: "Author account required",
      });
    }

    const token = createToken(user);

    res.json({
      success: true,
      message: "Author login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account required",
      });
    }

    const token = createToken(user);

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const user = await User.findById(req.user._id).select("name email role createdAt");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { name, email } = req.body;
    const updateFields = {};

    if (name) {
      updateFields.name = name.trim();
    }

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const emailTaken = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user._id },
      });

      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }

      updateFields.email = normalizedEmail;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    }).select("name email role createdAt");

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};