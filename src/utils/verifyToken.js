const User = require("../model/user.model.db");

module.exports = async (req, reply, done) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("No token was sent");
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findByToken(token);
    if (!user) {
      // handles logged out user with valid token
      throw new Error("Authentication failed!");
    }
    req.user = user;
    req.token = token; // used in logout route
    // done();
  } catch (error) {
    reply.code(401).send(error);
  }
};
