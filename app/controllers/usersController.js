const User = require("../models/User");

module.exports.register = (req, res) => {
  const body = req.body;
  console.log("register", body);
  const user = new User(body);
  user
    .save()
    .then(user => {
      const { _id, username, email } = user;
      console.log("rock", _id, username, email);
      res.json({ _id, username, email });
    })
    .catch(err => res.json(err));
};

module.exports.login = (req, res) => {
  const body = req.body;
  console.log(body);
  let user;
  User.findByCredentials(body.email, body.password)
    .then(userFound => {
      user = userFound;
      return user.generateToken();
    })
    .then(token => {
      user = { _id: user._id, username: user.username, email: user.email };
      res.json({
        token,
        user
      });
    })
    .catch(err => {
      res.json(err);
    });
};
module.exports.logout = (req, res) => {
  const { user, token } = req;
  User.findByIdAndUpdate(user._id, { $pull: { tokens: { token } } })
    .then(() => {
      res.json({ notice: "successfully logged out" });
    })
    .catch(err => res.josn(err));
};
