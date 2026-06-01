const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { register, authorLogin, adminLogin, getProfile, updateProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/author/login", authorLogin);
router.post("/admin/login", adminLogin);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
