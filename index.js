require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const urlParser = require("url");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const connectDB = require("./connect");
const UrlModel = require("./schema");

connectDB();

const options = {
  // Setting family as 6 i.e. IPv6
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:short_url", async (request, response) => {
  try {
    const data = await UrlModel.findOne({
      shortUrl: Number(request.params.short_url),
    });

    if (!data) {
      response.json({ error: "invalid url" });
    } else {
      response.redirect(data.originalUrl);
    }
  } catch (e) {
    response.json({ error: "invalid url" });
  }

  //console.log(data);
});

app.post("/api/shorturl", async (request, response) => {
  const url = request.body.url;

  dns.lookup(urlParser.parse(url).hostname, async (err, address) => {
    if (!address) {
      response.json({ error: "invalid url" });
    } else {
      const result = await UrlModel.countDocuments({});

      const newUrl = new UrlModel({
        originalUrl: url,
        shortUrl: result,
      });
      newUrl.save();
      response.json({
        original_url: newUrl.originalUrl,
        short_url: newUrl.shortUrl,
      });
    }
  });

  // response.json({ error: "invalid url" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
