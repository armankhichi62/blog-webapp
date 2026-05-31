const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  try {

    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      author: req.user.id
    });

    res.status(201).json({
      message: "Blog Created",
      blog
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
};