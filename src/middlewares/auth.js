const { User } = require("../models/User");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Please Login !" });
    }

    const decodedMessage = await jwt.verify(token, "Masharib1@");

    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found !");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
};

module.exports = { authUser };
