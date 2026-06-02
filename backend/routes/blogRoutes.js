const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  createBlog,
  submitForReview,
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  getPublishedBlogs,
  getBlogById,
  getBlogForEdit,
  updateBlog,
  deleteBlog,
  getDashboardStats,
  getAuthorAnalytics,
  likeBlog,
  addComment,
  getAllComments,
  getComments,
  deleteComment,
  addBookmark,
  getBookmarks,
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
upload.single("image"),
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
  "/:id",
  protect,
  authorize("author"),
  upload.single("image"),
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
console.log("getAllComments =", getAllComments);
router.get(
  "/comments",
  protect,
  authorize("admin"),
  getAllComments
);

router.get(
  "/comments/:blogId",
  getComments
);

router.delete(
  "/comment/:id",
  protect,
  authorize("admin"),
  deleteComment
);

router.post(
"/bookmark/:blogId",
protect,
addBookmark
);

router.get(
"/bookmarks",
protect,
getBookmarks
);

router.get(
  "/:id/edit",
  protect,
  authorize("author"),
  getBlogForEdit
);

router.get(
  "/:id",
  getBlogById
);



module.exports = router;