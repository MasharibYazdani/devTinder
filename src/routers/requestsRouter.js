const express = require("express");
const { authUser } = require("../middlewares/auth");
const { ConnectionModel } = require("../models/Conncetion");
const { validateConnectionRequest } = require("../utils/helper");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  authUser,
  async (req, res) => {
    try {
      await validateConnectionRequest(req);

      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const connectionRequest = new ConnectionModel({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      res.json({
        message: "Request sent successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Something went wrong " + error.message,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const { status, requestId } = req.params;

      const isAllowedStatus = ["accepted", "rejected"];

      if (!isAllowedStatus.includes(status)) {
        throw new Error("Status can be only accepted and rejected !");
      }

      const connectionRequest = await ConnectionModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("You can't accept and reject this request!");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: `Request ${status} successfully `,
        data,
      });
    } catch (error) {
      res.status(400).json({
        message: "Something went wrong " + error.message,
      });
    }
  }
);

module.exports = { requestRouter };
