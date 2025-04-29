const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./models/User");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateSignUp } = require("./utils/helper");
const { authUser } = require("./middlewares/auth");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);

    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();

    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
});

app.get("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials ");
    }

    const isPasswordCorrect = await user.verifyPassword(password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials ");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000),
    });

    res.send("User logged in successfully ");
  } catch (error) {
    res.status(400).send("Something went wrong. " + error.message);
  }
});

app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const data = await User.find();

    if (data.length == 0) {
      res.status(400).send("User not found !");
    } else {
      res.send(data);
    }
  } catch (error) {
    res.status(400).send("User can't be fetched !");
  }
});

app.get("/user", async (req, res) => {
  try {
    const email = req.body.emailId;
    const data = await User.findOne({ emailId: email });

    res.send(data);
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
});

app.patch("/update/:id", async (req, res) => {
  try {
    const userId = req.params?.id;
    const data = req.body;

    const ALLOWED_UPDATES = ["age", "gender", "photURL", "skills", "about"];

    const IS_UPDATE_ALLOWED = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!IS_UPDATE_ALLOWED) {
      throw new Error(
        "You can only update age, gender, photo, skills and about!"
      );
    }

    await User.findByIdAndUpdate(userId, data, { runValidators: true });

    res.send("User Updated Succesfully !");
  } catch (error) {
    res.status(400).send("User can't update " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB Connected");
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  });
