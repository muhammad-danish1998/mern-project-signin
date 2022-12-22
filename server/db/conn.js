
const mongoose = require("mongoose");

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {useNewUrlParser: true},mongoose.set('strictQuery', false))
  .then(() => {
    console.log("DataBase Connect SuccessFully");
  })
  .catch((err) => {
    console.log("No Connection");
  });

