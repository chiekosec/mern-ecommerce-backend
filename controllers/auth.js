const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.errors[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to store user",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.errors[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Email not found",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Password does not match",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signed out",
  });
};

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  requestProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let check = req.profile && req.auth && req.profile._id == req.auth.id;
  if (!check) {
    return res.status(400).json({
      error: "Access denied!!",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  let check = req.profile.role == 1;
  if (!check) {
    return res.status(400).json({ error: "Your're not admin. Acces denied!" });
  }
  next();
};
