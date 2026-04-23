const clothingItems = require("../models/clothingItems");
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItems
    .create({ name: name, weather: weather, imageUrl })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res.status(400).send({ message: "invalid data" });
      }
      res.status(500).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  clothingItems
    .findByIdandUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: "Error from updateItem", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send({}))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "DocumentNotFound" });
      }
      if (e.name === "CastError") {
        return res.status(400).send({ message: "InvalidId" });
      }
      res.status(500).send({ message: "Error from deleteItem", e });
    });
};

const likeItem = (req, res) => {
  return clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "DocumentNotFound" });
      }
      if (e.name === "CastError") {
        return res.status(400).send({ message: "InvalidId" });
      }
      res.status(500).send({ message: "Error from deleteItem", e });
    });
};
const dislikeItem = (req, res) => {
  return clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "DocumentNotFound" });
      }
      if (e.name === "CastError") {
        return res.status(400).send({ message: "InvalidId" });
      }
      res.status(500).send({ message: "Error from deleteItem", e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
