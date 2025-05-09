const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routers/authRouter");
const { profileRouter } = require("./routers/profileRouter");
const { requestRouter } = require("./routers/requestsRouter");
const { userRouter } = require("./routers/userRouter");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// app.get("/feed", async (req, res) => {
//   try {
//     const data = await User.find();

//     if (data.length == 0) {
//       res.status(400).send("User not found !");
//     } else {
//       res.send(data);
//     }
//   } catch (error) {
//     res.status(400).send("User can't be fetched !");
//   }
// });

// app.get("/user", async (req, res) => {
//   try {
//     const email = req.body.emailId;
//     const data = await User.findOne({ emailId: email });

//     res.send(data);
//   } catch (error) {
//     res.status(400).send("Something went wrong " + error.message);
//   }
// });

connectDB()
  .then(() => {
    console.log("DB Connected");
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  });
