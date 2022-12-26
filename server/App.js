const express = require("express");
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
app.use(cookieParser());

dotenv.config({ path: "./config.env" });
require("./db/conn");

app.use(express.json());
// link router file
app.use(require("./router/auth"));

const DB = process.env.DATABASE;

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App is Listen on Port localhost:${PORT}`);
});
