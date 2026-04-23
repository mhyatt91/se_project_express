const router = require("express").Router();
const clothingItems = require("./clothingItems");

const userRouter = require("./users");
router.use("/items", clothingItems);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
