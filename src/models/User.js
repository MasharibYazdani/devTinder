const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },

    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },

    about: {
      type: String,
      default: "Hi I am a developer.",
      maxLength: 500,
    },

    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid email !");
        }
      },
    },

    password: {
      type: String,
      required: true,

      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password !");
        }
      },
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Enter a valid gender (Male, Female, Others)");
        }
      },
    },

    photoURL: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",

      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter a valid URL !");
        }
      },
    },

    skills: {
      type: [String],

      validate(value) {
        if (value.length > 10) {
          throw new Error("You can add upto 10 skills.");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const _id = user._id;

  const token = await jwt.sign({ _id: _id }, "Masharib1@", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.verifyPassword = async function (passwordEnterByUser) {
  const user = this;

  const passwordHash = user.password;

  const isPasswordCorrect = await bcrypt.compare(
    passwordEnterByUser,
    passwordHash
  );

  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
