const User = require("../models/user");
const { INTERNAL_SERVER_ERROR } = require("../utils/errors");
const { BAD_REQUEST_ERROR } = require("../utils/errors");
const { NOT_FOUND } = require("../utils/errors");
const { CONFLICT_ERROR } = require("../utils/errors");
const { UNAUTHORIZED } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");

// GET /users

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "The server could not understand your request." });
    });
  // make sure status codes match .status
  // dont use hard coded numbers, instead, seperate files: const BAD REQUEST STATUS CODE = BAD_REQUEST_ERROR;
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch((err) => {
      console.error(err);

      // Handle validation errors
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).json({ message: "Invalid data" });
      }

      // Handle server errors
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);

      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "User with this email already exists" });
      }

      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "The server could not understand your request" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document Not Found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "Email and password are required" });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
};

module.exports = { getCurrentUser, createUser, getUser, updateProfile, login };
