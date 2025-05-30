const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://masharib:masharib@cluster0.21u3gud.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
