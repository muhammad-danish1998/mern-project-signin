const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
require("./db/conn");
// const userData = require("./model/userSchema")
app.use(express.json());
// link router file
app.use(require("./router/auth"));

const DB = process.env.DATABASE;

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App is Listen on Port localhost:${PORT}`);
});
