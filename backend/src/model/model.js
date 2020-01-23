var mongoose = require("mongoose");

var localUserSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true
    },
    salt: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
});

var googleUserSchema = new mongoose.Schema({
  username: String,   // user's email
  id: String,
  token: String,
  name: String,
})

var profileSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
    },
    headline: {
      type: String,
    },
    following: [{
      type: String,
    }],
    email: {
      type: String,
    },
    dob: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    avatar: {
      type: String,
    },
});

var postSchema = new mongoose.Schema({
    id: {
      type: Number,
      unique: true,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    picture: {
      type: String,
      //required: true
    },
    comments: [
      {
        commentId: {
          type: String,
          //unique: true,
          required: true
        },
        author: {
          type: String,
          required: true
        },
        body: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          required: true
        },
      }
    ]
});

module.exports.localUser = mongoose.model("users", localUserSchema);
module.exports.googleUser = mongoose.model("google-users", googleUserSchema);
module.exports.Profile = mongoose.model("profiles", profileSchema);
module.exports.Post = mongoose.model("posts", postSchema);
