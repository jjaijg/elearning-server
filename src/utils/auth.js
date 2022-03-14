const User = require("../model/user.model.db");

module.exports = async (req, reply) => {
  try {
    if (!req.body) {
      throw new Error("username and Password is required!");
    }
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    req.user = user;
  } catch (error) {
    reply.code(400).send(error);
  }
};
