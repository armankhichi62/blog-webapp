const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
//create blogs
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

//submit blogs
exports.submitForReview = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to submit this blog",
      });
    }

    blog.status = "pending";
    await blog.save();

    res.json({
      success: true,
      message: "Blog submitted for review",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//pending blogs
exports.getPendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "pending",
    }).populate("author", "name email");

    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//approve blogs
exports.approveBlog = async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    blog.status = "approved";

    await blog.save();

    res.json({
      message: "Blog approved successfully",
      blog
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

//reject blogs
exports.rejectBlog = async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    blog.status = "rejected";

    await blog.save();

    res.json({
      message: "Blog rejected successfully",
      blog
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

//published blogs
exports.getPublishedBlogs = async (req, res) => {
  try {
    const { search, category } = req.query;

    // Build filter object
    const filter = { status: "approved" };

    // Add search filter (case-insensitive title search)
    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    // Add category filter
    if (category && category.trim()) {
      filter.category = category.trim();
    }

    const blogs = await Blog.find(filter).populate(
      "author",
      "name"
    );

    res.json(blogs);

  } catch (error) {

    res.status(500).json(error.message);

  }
};

//
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email");

    if (!blog || blog.status !== "approved") {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Get blog for editing (author only)
exports.getBlogForEdit = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own blogs",
      });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this blog",
      });
    }

    blog.title = req.body.title?.trim() || blog.title;
    blog.content = req.body.content?.trim() || blog.content;
    blog.category = req.body.category?.trim() || blog.category;

    await blog.save();

    res.json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this blog",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//
exports.getDashboardStats = async (req,res)=>{

try{

const totalBlogs =
await Blog.countDocuments();

const approvedBlogs =
await Blog.countDocuments({
status:"approved"
});

const pendingBlogs =
await Blog.countDocuments({
status:"pending"
});

const rejectedBlogs =
await Blog.countDocuments({
status:"rejected"
});

res.json({

totalBlogs,
approvedBlogs,
pendingBlogs,
rejectedBlogs

});

}
catch(error){

res.status(500).json(
error.message
);

}

};

// Author analytics for author dashboard
exports.getAuthorAnalytics = async (req, res) => {
  try {
    const authorId = req.user.id || req.user._id;

    // Get all blogs for this author with comments count
    const blogPerformance = await Blog.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(authorId) } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'blog',
          as: 'comments'
        }
      },
      {
        $addFields: {
          commentsCount: { $size: '$comments' }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          likes: 1,
          commentsCount: 1
        }
      }
    ]);

    const totalBlogs = blogPerformance.length;
    const draftBlogs = blogPerformance.filter(b => (b.status || '').toLowerCase() === 'draft').length;
    const pendingBlogs = blogPerformance.filter(b => (b.status || '').toLowerCase() === 'pending').length;
    const approvedBlogs = blogPerformance.filter(b => (b.status || '').toLowerCase() === 'approved' || (b.status || '').toLowerCase() === 'published').length;
    const rejectedBlogs = blogPerformance.filter(b => (b.status || '').toLowerCase() === 'rejected').length;

    const totalLikesReceived = blogPerformance.reduce((acc, b) => acc + (b.likes || 0), 0);
    const totalCommentsReceived = blogPerformance.reduce((acc, b) => acc + (b.commentsCount || 0), 0);

    res.json({
      totalBlogs,
      draftBlogs,
      pendingBlogs,
      approvedBlogs,
      rejectedBlogs,
      totalLikesReceived,
      totalCommentsReceived,
      blogPerformance
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//
exports.addComment = async(req,res)=>{

try{

const comment=
await Comment.create({

blog:req.params.blogId,

user:req.user.id,

content:req.body.content

});

res.status(201).json(comment);

}
catch(error){

res.status(500).json(
error.message
);

}

};


//get commentss
exports.getComments = async(req,res)=>{

try{

const comments = await Comment.find({
blog:req.params.blogId
})
.populate("user","name")
.sort({createdAt:-1});

res.status(200).json(comments);

}
catch(error){

res.status(500).json(
error.message
);

}

};

//like blog
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const userId = req.user.id.toString();
    blog.likedBy = Array.isArray(blog.likedBy) ? blog.likedBy : [];

    const alreadyLiked = blog.likedBy.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      blog.likedBy = blog.likedBy.filter(
        (id) => id.toString() !== userId
      );
    } else {
      blog.likedBy.push(userId);
    }

    blog.likes = blog.likedBy.length;
    await blog.save();

    res.json({
      success: true,
      data: {
        likes: blog.likes,
        liked: !alreadyLiked,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





//
exports.getMyBlogs = async (req, res) => {
  try {
    const authorId = req.user.id || req.user._id;

    // Aggregate blogs for the author and include commentsCount
    const blogs = await Blog.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(authorId) } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'blog',
          as: 'comments'
        }
      },
      {
        $addFields: {
          commentsCount: { $size: '$comments' }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          category: 1,
          status: 1,
          likes: 1,
          commentsCount: 1,
          content: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json(blogs);
  } catch (error) {
    res.status(500).json(error.message);
  }
};