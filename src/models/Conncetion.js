const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["ignored", "interested", "accepted", "rejected"],
    },
  },
  { timestamps: true }
);

ConnectionSchema.index({ fromUserId: 1, toUserId: 1 });

//This method will called just before the save function and it is like a middleware
ConnectionSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Con't send request to yourself");
  }
  next();
});

const ConnectionModel = mongoose.model("ConnectionModel", ConnectionSchema);

module.exports = { ConnectionModel };
