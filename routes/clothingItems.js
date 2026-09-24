const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateID,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", auth, validateClothingItem, createItem);
router.delete("/:itemId", auth, validateID, deleteItem);
router.put("/:itemId/likes", auth, validateID, likeItem);
router.delete("/:itemId/likes", auth, validateID, dislikeItem);

router.get("/", getItems);

module.exports = router;
