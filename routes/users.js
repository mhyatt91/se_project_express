const router = require("express").Router();
const {
  getCurrentUser,
  createUser,
  getUser,
  updateProfile,
} = require("../controllers/users");
const auth = require("../middlewares/auth.js");

// GET /users/me - get current user
router.get("/me", auth, getCurrentUser);

// PATCH /users/me - update current user profile
router.patch("/me", auth, updateProfile);

//todo: create login endpoint
//router.post("/signin", login);

module.exports = router;
