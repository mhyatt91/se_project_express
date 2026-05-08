const User = require("../models/user");
const { INTERNAL_SERVER_ERROR } = require("../utils/errors");
const { BAD_REQUEST_ERROR } = require("../utils/errors");
const { NOT_FOUND } = require("../utils/errors");
const { CONFLICT_ERROR } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// GET /users

const getCurrentUser = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
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

  if (!email || !password) {
    res.status(BAD_REQUEST_ERROR).send({
      message: "Something..",
    });

    return;
  }

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
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "The server could not understand your request." });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT_ERROR).send({ message: "Conflict Error" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "The server could not understand your request." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.user;
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

  module.exports.login = (req, res) => {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
      .then((user) => {
        // authentication successful! user is in the user variable
      })
      .catch((err) => {
        // authentication error
        res.status(401).send({ message: err.message });
      });
  };
};
module.exports = { getCurrentUser, createUser, getUser, updateProfile };
