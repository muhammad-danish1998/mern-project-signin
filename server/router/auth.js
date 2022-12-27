const express = require("express");
const User = require("../model/userSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
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
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
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
// -------------- About us Page -----------------
router.post("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

// -------------- contact us Page -----------------
router.post("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});
// ------------ contact us page Route------------
router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.json({ error: "please fill the contact Form" });
    }
    const userContact = await User.findOne({ _id: req.userID });
    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      await userContact.save()
      res.status(201).json({message: "user Contact Successfully"})
    }
  } catch (error) {
    console.log(error);
  }
});
// -------------- Logout Page -----------------
router.get("/logout", (req, res) => {
  res.clearCookie('jwtoken',{path:"/"})
  res.status(200).send("Logout Page");
  console.log("User Logout");
});

module.exports = router;
