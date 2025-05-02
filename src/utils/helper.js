const validator = require("validator");
const { User } = require("../models/User");
const { ConnectionModel } = require("../models/Conncetion");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (firstName.length < 3 || firstName.length > 20) {
    throw new Error(
      "Lenght of First name must be greater than 3 and less than 20."
    );
  } else if (lastName && (lastName.length < 3 || lastName.length > 20)) {
    throw new Error(
      "Lenght of Last name must be greater than 3 and less than 20."
    );
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid email.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password.");
  }
};

const validateEditData = (req) => {
  const data = req.body;
  const ALLOWED_UPDATES = ["age", "gender", "photURL", "skills", "about"];

  const IS_UPDATE_ALLOWED = Object.keys(data).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  if (!IS_UPDATE_ALLOWED) {
    throw new Error(
      "You can only update age, gender, photo, skills and about!"
    );
  }

  const { age, gender, photURL, skills, about } = req.body;

  if (age && age < 18) {
    throw new Error("Age should be greater than 18!");
  } else if (gender && !["Male", "Female", "Other"].includes(gender)) {
    throw new Error("Gender can be only Male, Female, or Other");
  } else if (photURL && !validator.isURL(photURL)) {
    throw new Error("Enter a valid URL");
  } else if (skills && skills.length > 10) {
    throw new Error("You can add up to 10 skills only");
  } else if (about && about.length > 500) {
    throw new Error("You can add up to 500 characters in about");
  }
};

const validatePassword = async (req) => {
  const { password, newPassword, confirmPassword } = req.body;
  const user = req.user;

  if (!password || !newPassword || !confirmPassword) {
    throw new Error("Enter all three fileds !");
  }

  const isPasswordCorrect = await user.verifyPassword(password);

  if (!isPasswordCorrect) {
    throw new Error("Enter the correct password !");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Enter a strong new Password !");
  }

  if (!(newPassword === confirmPassword)) {
    throw new Error("New Password Confirm Password are different !");
  }

  return newPassword;
};

const validateConnectionRequest = async (req) => {
  const fromUserId = req.user._id;
  const toUserId = req.params.userId;
  const status = req.params.status;

  const toUser = await User.findById(toUserId);

  if (!toUser) {
    throw new Error("User doesn't exist!");
  }

  const Allowed_Updates = ["interested", "ignored"];

  if (!Allowed_Updates.includes(status)) {
    throw new Error("Status can be only interested or ignored!");
  }

  if (fromUserId.equals(toUserId)) {
    throw new Error("You can't send connection request to yourself!");
  }

  const requestSentByYou = await ConnectionModel.findOne({
    fromUserId,
    toUserId,
  });

  if (requestSentByYou) {
    throw new Error("You have already sent request !");
  }

  const requestSentByThem = await ConnectionModel.findOne({
    fromUserId: toUserId,
    toUserId: fromUserId,
  });

  if (requestSentByThem) {
    throw new Error("They have already sent you request !");
  }
};

module.exports = {
  validateSignUp,
  validateEditData,
  validatePassword,
  validateConnectionRequest,
};
