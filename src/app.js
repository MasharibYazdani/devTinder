const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./models/User");
const { connectDB } = require("./config/database");

const bcrypt = require("bcrypt");

const { validateSignUp } = require("./utils/helper");

const app = express();
const port = 3000;

const { authAdmin } = require("./middlewares/auth");

app.use(express.json());

// app.use("/", authAdmin);

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
    const { emailId, password } = req.body.emailId;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials ");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials ");
    }

    res.send("User logged in successfully ");
  } catch (error) {
    res.status(400).send("Something went wrong. " + error.message);
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
