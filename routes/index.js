const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const clothingItems = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const userRouter = require("./users");
const auth = require("../middlewares/auth");
const NotFoundError = require("../utils/errors/not-found-err");

router.post("/signup", createUser);
router.post("/signin", login);
router.use("/items", clothingItems);
router.use("/users", auth, userRouter);
router.use((req, res, next) => {
  return next(new NotFoundError("User not found"));
});

module.exports = router;
