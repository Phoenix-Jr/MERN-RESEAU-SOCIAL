const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/config.env" });
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });
