const { login, createUser } = require("../controllers/users");
const router = require("express").Router();
const clothingItems = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const userRouter = require("./users");
const users = require("./users");
const auth = require("../middlewares/auth.js");

router.post("/signin", auth, login);
router.post("signup", auth, createUser);
router.use("/items", auth, clothingItems);
router.use("/users", auth, userRouter);
router.use("/users", users);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
