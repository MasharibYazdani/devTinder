const mongoose = require("mongoose");
const validator = require("validator");

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
    },

    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,

      validate(value) {
        if (!validator.isEmail("value")) {
          throw new Error("Enter a valid email !");
        }
      },
    },

    password: {
      type: String,
      required: true,

      validate(value) {
        if (!isStrongPassword(value)) {
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

    photURL: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",

      validate(value) {
        if (!isURL(value)) {
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

const User = mongoose.model("User", userSchema);

module.exports = { User };
