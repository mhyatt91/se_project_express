const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { INTERNAL_SERVER_ERROR } = require("../utils/errors");
const { BAD_REQUEST_ERROR } = require("../utils/errors");
const { NOT_FOUND } = require("../utils/errors");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const InternalServerError = require("../utils/errors/internal-server-err");
const BadRequestError = require("../utils/errors/bad-request-err");
const NotFound = require("../utils/errors/not-found-err");
const Unauthorized = require("../utils/errors/unauthorized-err");

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      return next(new InternalServerError("Internal Server Error"));
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
        return next(new NotFound("User not found"));
      }
      return res.json(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid Id"));
      }
      return next(new InternalServerError("Internal Server Error"));
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
      const { userPassword, ...userWithoutPassword } = user.toObject();
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
        return next(new BadRequestError("Invalid Id"));
      }
      return next(new InternalServerError("Internal Server Error"));
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
        return next(new NotFound("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid Id"));
      }
      return next(new InternalServerError("Internal Server Error"));
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Invalid Id"));
  }

  return User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign({ _id: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  });
  return next(new Unauthorized("Authorization Required"));
};

module.exports = { getCurrentUser, createUser, getUser, updateProfile, login };
