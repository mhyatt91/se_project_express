const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

// GET /users/me - get current user
router.get("/me", auth, getCurrentUser);

// PATCH /users/me - update current user profile
router.patch("/me", auth, validateUserUpdate, updateProfile);

module.exports = router;
