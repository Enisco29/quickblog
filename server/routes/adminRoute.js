import express from "express";
import {
  adminLogin,
  approveCommentById,
  deleteCommentById,
  deleteUser,
  demoteToUser,
  getAllBlogsAdmin,
  getAllComments,
  getAllUsers,
  getDashboard,
  promoteToAdmin,
  toggleAdminStatus,
} from "../controllers/adminController.js";
import {
  verifySuperAdmin,
  authUser,
  verifyAdmin,
} from "../middlewares/authUser.js";
import { login } from "../controllers/userController.js";

const adminRouter = express.Router();

adminRouter.post("/login", login); //done
adminRouter.get("/users", authUser, verifySuperAdmin, getAllUsers);
adminRouter.post(
  "/toggle-admin",
  authUser,
  verifySuperAdmin,
  toggleAdminStatus
);
adminRouter.post("/delete", authUser, verifySuperAdmin, deleteUser);
adminRouter.get("/comments", authUser, verifySuperAdmin, getAllComments); //done
adminRouter.get("/blogs", authUser, verifySuperAdmin, getAllBlogsAdmin); //done
adminRouter.post(
  "/delete-comment",
  authUser,
  verifySuperAdmin,
  deleteCommentById
); //done
adminRouter.post(
  "/approve-comment",
  authUser,
  verifySuperAdmin,
  approveCommentById
); //done
adminRouter.get("/dashboard-admin", authUser, verifyAdmin, getDashboard); //done
adminRouter.get("/dashboard", authUser, verifySuperAdmin, getDashboard); //done

export default adminRouter;
