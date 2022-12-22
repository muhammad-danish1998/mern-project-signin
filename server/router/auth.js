const express = require("express");
const User = require("../model/userSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");
const middleware = (req, res, next) => {
  console.log("Please Login First");
  next();
};
router.get("/", (req, res) => {
  res.send("Hello World");
});
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  //   -------------- if there is any empty field --------------------
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please field all Field" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "User Email is Already exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password are not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      //------------------- hashing ------------------

      await user.save();

      res.status(201).json({ message: "User Register Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/login", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  try {
    //   -------------- if there is any empty field --------------------
    if (!email || !password) {
      return res.status(400).json({ error: "Please field all Field" });
    }
    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      
      // ------------------- genrate Auth Token
      const token = await userLogin.generateAuthToken();
      console.log(token);
      // ----------- store token in cookie -------- 
      res.cookie("jwtoken", token,{
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true
      });
      if (!isMatch) {
        res.status(400).json({ error: "InValid Crediential  " });
      } else {
        res.status(200).json({ message: "User Login SucessFully" });
      }
    } else {
      res.status(400).json({ error: "InValid Crediential  " });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
