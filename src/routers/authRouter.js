const express = require("express");
const authRouter = express.Router();
const { validateSignUp } = require("../utils/helper");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("User logged out successfully !");
  } catch (error) {
    res.status(400).send("Error while logging out " + error.message);
  }
});

module.exports = { authRouter };
