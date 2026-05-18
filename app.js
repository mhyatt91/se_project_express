const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const userRouter = require("express").Router();
const itemRouter = require("express").Router();
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const { login, createUser } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(express.json());
app.use("/users", auth, userRouter);
app.use("/items", auth, itemRouter);
app.use("/", mainRouter);
app.post("signin", login);
app.post("signup", createUser);
app.listen(PORT, () => {});
