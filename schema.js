const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: Number,
    required: true,
  },
});

const UrlModel = mongoose.model("Url", UrlSchema);

module.exports = UrlModel;
