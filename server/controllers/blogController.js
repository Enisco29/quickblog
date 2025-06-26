import fs from "fs";
import imageKit from "../configs/imageKit.js";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";
import main from "../configs/gemini.js";

//only admin can add a blog
export const addBlog = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, subtitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );

    const imageFile = req.file;

    //Check if all fields are present
    if (!title || !description || !category || !imageFile || !userId) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }
    //converts the file to 64 bit format
    const fileBuffer = fs.readFileSync(imageFile.path);

    //Uplaod image to image kit
    const response = await imageKit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    // console.log("urlEndpoint:", process.env.IMAGEKIT_URL_ENDPOINT);
    // console.log("filePath:", response.filePath);

    //optimization through imagekit URL transformation
    const optimizedImageUrl = imageKit.url({
      path: response.filePath,
      transformation: [
        {
          quality: "auto", //Auto Compression
        },
        {
          format: "webp", //Convert to modern format
        },
        {
          width: "1280", //Width resizing
        },
      ],
    });

    const image = optimizedImageUrl;

    await Blog.create({
      user: userId,
      title,
      subtitle,
      description,
      category,
      image,
      isPublished,
    });

    res.json({
      success: true,
      message: "Blog added successfully",
    });
  } catch (error) {
    console.error("Full error:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
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

//get individual blog by id for authenticated users
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    console.log("getBlogById called with blogId:", req.params.blogId);

    const blog = await Blog.findById(blogId).populate("user", "name");
    if (!blog) {
      return res.json({
        success: false,
        message: "Blog not found",
      });
    }
    res.json({
      success: true,
      blog,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//delete blog for admin
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);

    //Delete all comments associated with the blog
    await Comment.deleteMany({ blog: id });
    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//Toggle publish status of a blog for admin
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({
      success: true,
      message: "Blog status updated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// export const addComment = async (req, res) => {
//   try {
//     const { blog, name, content } = req.body;
//     await Comment.create({ blog, name, content });
//     res.json({
//       success: true,
//       message: "Comment added for review",
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//adding comment for authenticated users
export const addComment = async (req, res) => {
  try {
    const { blog, content } = req.body;
    const { userId } = req.user;

    if (!blog || !content) {
      return res.status(400).json({
        success: false,
        message: "Blog ID and content are required",
      });
    }

    const blogExists = await Blog.findOne({
      _id: blog,
      isPublished: true, // Ensure the blog is published
    });
    if (!blogExists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const newComment = await Comment.create({
      blog,
      content,
      user: userId,
    });

    // Populate user details
    const populatedComment = await Comment.populate(newComment, {
      path: "user",
      select: "name",
    });

    res.status(201).json({
      success: true,
      message: "Comment added for review",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getBlogComment = async (req, res) => {
  try {
    const { blogId } = req.body;

    console.log("getBlogById called with blogId:", req.body.blogId);
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .populate("user", "name");
    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + " Generate a blog content for this topic in simple text format."
    );
    res.json({
      success: true,
      content,
      message: "Content generated successfully",
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
