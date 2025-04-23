const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (firstName.length < 4 || firstName.length > 20) {
    throw new Error(
      "Lenght of First name must be greater than 3 and less than 20."
    );
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid email.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password.");
  }
};

module.exports = { validateSignUp };
