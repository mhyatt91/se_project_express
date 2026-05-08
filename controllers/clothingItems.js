const clothingItems = require("../models/clothingItems");

const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItems
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findById(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "Item successfully deleted" }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "DocumentNotFound" });
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "InvalidId" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from deleteItem", e });
    });
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
        return res.status(NOT_FOUND).send({ message: "DocumentNotFound" });
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "InvalidId" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from deleteItem" });
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
        return res.status(NOT_FOUND).send({ message: "DocumentNotFound" });
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "InvalidId" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from deleteItem" });
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
