const clothingItems = require("../models/clothingItems");

const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND,
  FORBIDDEN,
} = require("../utils/errors");

const InternalServerError = require("../utils/errors/internal-server-err");
const BadRequestError = require("../utils/errors/bad-request-err");
const NotFound = require("../utils/errors/not-found-err");
const Unauthorized = require("../utils/errors/unauthorized-err");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItems
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return next(new BadRequestError("Invalid Id"));
      }
      return next(new InternalServerError("Internal Server Error"));
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(() => next(new InternalServerError("Internal Server Error")));
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await clothingItems.findById(itemId).orFail();

    if (!item.owner.equals(req.user._id)) {
      return res.status(FORBIDDEN).send({ message: "Access denied" });
    }
    await clothingItems.findByIdAndDelete(itemId);

    return res.status(200).send({ message: "Item successfully deleted" });
  } catch (e) {
    if (e.name === "CastError") {
      return next(new BadRequestError("Invalid Id"));
    }
    if (e.name === "DocumentNotFoundError") {
      return next(new NotFound("User not found"));
    }
    return next(new InternalServerError("Internal Server Error"));
  }
};

const likeItem = (req, res) =>
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFound("User not found"));
      }
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid Id"));
      }
      return next(new InternalServerError("Internal Server Error"));
    });

const dislikeItem = (req, res) =>
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFound("User not found"));
      }
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid Id"));
      }
      return next(new InternalServerError("Internal Server Error"));
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
