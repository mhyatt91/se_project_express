const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

// GET /users/me - get current user
router.get("/me", auth, getCurrentUser);

// PATCH /users/me - update current user profile
router.patch("/me", auth, updateProfile);

module.exports = router;
