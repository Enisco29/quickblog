import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";
import UserModel from "../models/userModel.js";

export const superAdminLogin = async (req, res) => {
  const existingAdmin = await UserModel.findOne({
    email: process.env.ADMIN_EMAIL,
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await UserModel.create({
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "super-admin",
    });
    console.log("super-admin created");
  }
};

superAdminLogin();

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      }); //
    }

    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//super-admin
export const getAllUsers = async (req, res) => {
  try {
    //verify super admin role
    if (req.user.role !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Admin access required",
      });
    }

    const users = await UserModel.find()
      .select("-password -__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const toggleAdminStatus = async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.user._id) {
      return res
        .status(400)
        .json({ message: "Cannot change your own admin status" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${user.role}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify your own role",
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true }
    ).select("-password -__v");

    res.status(200).json({
      message: `${user.email} promoted to Admin`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const demoteToUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify your own role",
      });
    }
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { role: "user" },
      { new: true }
    ).select("-password -__v");

    res.status(200).json({
      message: `${user.email} demoted to User`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.user._id) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    await UserModel.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("user", "name")
      .populate("blog", "title")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      comments,
    });

    console.log(comments);
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });

    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs,
    };

    res.json({
      success: true,
      dashboardData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isApproved: true });
    res.json({
      success: true,
      message: "Comment approved successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
