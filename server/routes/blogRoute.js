import express from "express";
import upload from "../middlewares/multer.js";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComment,
  togglePublish,
} from "../controllers/blogController.js";
import {
  authUser,
  verifyAdmin,
  verifySuperAdmin,
} from "../middlewares/authUser.js";

const blogRouter = express.Router();

blogRouter.post(
  "/add",
  upload.single("image"),
  authUser,
  verifySuperAdmin,
  addBlog
); //done
blogRouter.post(
  "/admin-add",
  upload.single("image"),
  authUser,
  verifyAdmin,
  addBlog
); //done
blogRouter.delete("/admin-delete", authUser, verifyAdmin, deleteBlogById); //done //delete blog for admin
blogRouter.get("/all", getAllBlogs); //for users //done

blogRouter.post("/delete", authUser, verifySuperAdmin, deleteBlogById); //done //delete blog for super-admin
blogRouter.post("/toggle-publish", authUser, verifySuperAdmin, togglePublish); //done

blogRouter.post("/add-comment", authUser, addComment); //done
blogRouter.post("/comments", authUser, getBlogComment); //done
blogRouter.post("/generate", authUser, verifySuperAdmin, generateContent);
blogRouter.post("/generate-admin", authUser, verifyAdmin, generateContent);

blogRouter.post("/:blogId", authUser, getBlogById); //done

export default blogRouter;
