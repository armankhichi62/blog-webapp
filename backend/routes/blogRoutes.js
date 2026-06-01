const express = require("express");
const router = express.Router();

const {
  createBlog,
  submitForReview,
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  getPublishedBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getDashboardStats,
  likeBlog,
  addComment,
  getComments,
  getMyBlogs,


} = require("../controllers/postController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

router.post(
  "/create",
  protect,
  authorize("author"),
  createBlog
);

router.get(
  "/myblogs",
  protect,
  authorize("author"),
  getMyBlogs
);

router.put(
  "/submit/:id",
  protect,
  authorize("author"),
  submitForReview
);

router.get(
  "/pending",
  protect,
  authorize("admin"),
  getPendingBlogs
);

router.put(
  "/approve/:id",
  protect,
  authorize("admin"),
  approveBlog
);

router.put(
  "/reject/:id",
  protect,
  authorize("admin"),
  rejectBlog
);

router.get(
  "/published",
  getPublishedBlogs
);

router.put(
  "/update/:id",
  protect,
  authorize("author"),
  updateBlog
);


router.delete(
  "/delete/:id",
  protect,
  authorize("author"),
  deleteBlog
);

router.get(
  "/stats/dashboard",
  protect,
  authorize("admin"),
  getDashboardStats
);

router.get(
  "/stats/author",
  protect,
  authorize("author"),
  getAuthorAnalytics
);

router.put(
  "/like/:id",
  protect,
  likeBlog
);

router.post(
  "/comment/:blogId",
  protect,
  addComment
);

router.get(
  "/comments/:blogId",
  getComments
);

router.get(
  "/:id",
  getBlogById
);



module.exports = router;