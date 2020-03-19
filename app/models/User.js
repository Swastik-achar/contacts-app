const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return validator.isEmail(value);
      },
      message: {
        notice: "Email format invalid"
      }
    },
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  tokens: [
    {
      token: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Number(Date.now())
  }
});

userSchema.pre("save", function(next) {
  const user = this;
  if (user.isNew) {
    bcryptjs.genSalt(10).then(salt => {
      bcryptjs.hash(user.password, salt).then(encryptedPassword => {
        user.password = encryptedPassword;
        console.log(encryptedPassword)
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.statics.findByCredentials = function(email, password) {
  const User = this;
  console.log(email)
  return User.findOne({ email })
    .then(user => {
      if (!user) {
        return Promise.reject({
          errors: "Invalid email/password"
        });
      }

      return bcryptjs.compare(password, user.password).then(result => {
        if (result) {
          return Promise.resolve(user);
        } else {
          return Promise.reject({
            errors: "Invalid email/password"
          });
        }
      });
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

userSchema.methods.generateToken = function() {
  const user = this;
  const tokenData = {
    _id: user._id,
    username: user.username,
    createdAt: new Date()
  };

  const token = jwt.sign(tokenData, "json1234");
  user.tokens.push({ token });
  return user
    .save()
    .then(user => {
      return Promise.resolve(token);
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

userSchema.statics.findByToken = function(token) {
  console.log(token)
  const User = this;
  let tokenData;
  try {
    tokenData = jwt.verify(token, "json1234");
  } catch (err) {
    return Promise.reject(err);
  }

  return User.findOne({
    _id: tokenData._id,
    "tokens.token": token
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
