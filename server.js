const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user.routes");
require("dotenv").config({ path: "./config/config.env" });
require("./config/db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);

// server
app.listen(process.env.PORT, () => {
  console.log(`Listenning on ${process.env.PORT}`);
});
