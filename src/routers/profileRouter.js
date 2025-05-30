const express = require("express");
const profileRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const { validateEditData, validatePassword } = require("../utils/helper");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    res.status(401).send("Something went wrong " + error.message);
  }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    validateEditData(req);

    const data = req.body;
    const user = req.user;

    Object.keys(data).forEach((key) => {
      user[key] = data[key];
    });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).send("User can't update " + error.message);
  }
});

profileRouter.patch("/profile/forgotPassword", authUser, async (req, res) => {
  try {
    const newPassword = await validatePassword(req);

    const user = req.user;

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;

    await user.save();

    res.send("Password Updated Successfully !");
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
});

module.exports = { profileRouter };
