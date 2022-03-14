const User = require("../model/user.model.db");

module.exports = {
  create: async (req, reply) => {
    const user = new User(req.body);
    try {
      await user.save();
      const token = await user.generateToken();
      reply.status(201).send({ user, token });
    } catch (error) {
      reply.status(400).send(error);
    }
  },
  login: async (req, reply) => {
    const token = await req.user.generateToken();
    const { _id, username } = req.user;
    reply.send({ status: "You are logged in", user: { _id, username }, token });
  },
  profile: async (req, reply) => {
    reply.send({
      status: "Authenticated!",
      user: {
        username: req.user.username,
        _id: req.user._id,
        tokens: req.user.tokens,
      },
    });
  },
  logout: async (req, reply) => {
    try {
      req.user.tokens = req.user.tokens?.filter((token) => {
        return token.token !== req.token;
      });
      const loggedOutUser = await req.user.save();
      reply.send({ status: "You are logged out!", user: loggedOutUser });
    } catch (e) {
      console.log(e);
      reply.status(500).send({ message: "Error while trying to logout!" });
    }
  },
};
