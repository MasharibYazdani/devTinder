const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./models/User");
const { connectDB } = require("./config/database");

const app = express();
const port = 3000;

const { authAdmin } = require("./middlewares/auth");

app.use(express.json());

// app.use("/", authAdmin);

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

app.patch("/update", async (req, res) => {
  try {
    const email = req.body.emailId;

    const data = await User.findOneAndUpdate(
      { emailId: email },
      { firstName: "King" }
    );

    res.send("User Updated Succesfully !");
  } catch (error) {
    res.status(400).send("User can't update " + error.message);
  }
});

app.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const user = new User(data);
    await user.save();

    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
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
