const authAdmin = (req, res, next) => {
  try {
    const token = "abc";
    const isAuthorized = token === "abc";

    if (!isAuthorized) {
      res.status(401).send("Unauthorized user");
    }
    console.log("authadmin called");
    next();
  } catch (error) {
    console.log("Something went wrong " + error.message);
  }
};

module.exports = { authAdmin };
