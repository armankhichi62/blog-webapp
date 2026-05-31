const express = require("express");
const router = express.Router();

const { createBlog } = require("../controllers/postController");

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

module.exports = router;