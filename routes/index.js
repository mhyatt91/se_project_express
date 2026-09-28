const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const NotFoundError = require("../utils/errors/not-found-err");

router.post("/signup", createUser);
router.post("/signin", login);
router.use("/items", clothingItems);
router.use("/users", userRouter);
router.use((req, res, next) => next(new NotFoundError("User not found")));

module.exports = router;
