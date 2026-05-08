const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  email: { String, required: true },
  password: { type: String, required: true, minlength: 2, maxlength: 15 },
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: true,
  },
});

module.export = mongoose.model("user", clothingItemSchema);
