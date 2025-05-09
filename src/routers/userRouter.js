const express = require("express");
const { ConnectionModel } = require("../models/Conncetion");
const { authUser } = require("../middlewares/auth");
const { User } = require("../models/User");
const userRouter = express.Router();

const userDetails = "firstName lastName photoUrl about skills";

userRouter.get("/user/requests", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .sort({ createdAt: -1 })
      .populate("fromUserId", userDetails);

    if (connectionRequest.length === 0) {
      throw new Error("You don't have any connection request !");
    }

    const data = connectionRequest.map((request) => request.fromUserId);

    res.json({
      message: "All requests retrieved successfully !",
      connectionRequest,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong " + error.message });
  }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", userDetails)
      .populate("toUserId", userDetails)
      .sort({ createdAt: -1 });

    const data = connections.map((request) => {
      if (request.fromUserId._id.equals(loggedInUser._id)) {
        return request.toUserId;
      } else {
        return request.fromUserId;
      }
    });

    res.json({
      message: "All connections are retrieved !",
      data,
    });
  } catch (error) {
    req.status(400).json({
      message: "Something went wrong " + error.message,
    });
  }
});

userRouter.get("/user/feed", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * 10;

    const connections = await ConnectionModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const excludeUsers = new Set();

    connections.forEach((con) => {
      excludeUsers.add(con.fromUserId.toString());
      excludeUsers.add(con.toUserId.toString());
    });

    excludeUsers.add(loggedInUser._id.toString());

    const userFeed = await User.find({
      _id: { $nin: Array.from(excludeUsers) },
    })
      .select(userDetails)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "User feed fetched.",
      userFeed,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong " + error.message,
    });
  }
});
module.exports = { userRouter };
