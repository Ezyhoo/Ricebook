if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// initializeData = async () => {
//   const fs = require("fs");
//   const bcrypt = require("bcrypt");
//   const userModel = require("./src/model/model").localUser;
//   const profileModel = require("./src/model/model").Profile;
//   const postModel = require("./src/model/model").Post;
//   const count = await userModel.findOne();
//   //console.log(count);
//   if (count !== null && count !== undefined) {
//     return;
//   }
//   fs.readFile("./sampleData.json", "utf8", async (err, data) => {
//     if (err) {
//       throw err;
//     }
//     try {
//       const preInfo = JSON.parse(data);

//       const user = preInfo[0];

//       let newUser = new userModel();
//       newUser.username = user.username;
//       newUser.salt = await bcrypt.genSalt();
//       newUser.password = await bcrypt.hash(user.password, newUser.salt);
//       await newUser.save();

//       let newProfile = new profileModel();
//       (newProfile.username = user.username),
//         (newProfile.headline = user.headline),
//         (newProfile.following = []),
//         (newProfile.email = user.email),
//         (newProfile.dob = user.dob),
//         (newProfile.zipcode = user.zipcode),
//         (newProfile.avatar = "");
//       await newProfile.save();
//       //console.log(await userModel.find());

//       for (let i = 1; i <= 5; i++) {
//         let newArticle = new postModel();
//         newArticle.id = await postModel.countDocuments();
//         newArticle.author = preInfo[i].author;
//         newArticle.body = preInfo[i].text;
//         newArticle.date = new Date();
//         newArticle.comments =
//           preInfo[i].comments === undefined ? [] : preInfo[i].comments;
//         newArticle.picture = "";
//         await newArticle.save();
//       }
//     } catch (err) {
//       throw err;
//     }
//   });
// };

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "16mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "16mb" }));


const session = require("express-session");
app.use(
  session({
    secret: "thisIsMySecretMessageHowWillYouGuessIt",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());


const cors = require("cors");

// tge surge would redirect to
const whitelist = "http://ricebook_ezyhoo.surge.sh";
app.use(cors({ origin: whitelist, credentials: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());


const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to database"))
  //.then(() => initializeData())
  .catch(err => {
    console.log(err.message);
  });

// const db = mongoose.connection;
// db.on('error', (error) => console.error(error));
// db.once('open', () => console.log("Connected to Database"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  const addr = server.address();
  console.log(`Server listening at ${port}`);
});

let auth = require("./src/auth");
auth(app);

let profile = require("./src/profile");
profile(app);

let article = require("./src/article");
article(app);

let following = require("./src/following");
following(app);

app.delete("/clearDB", (req, res) => {
  try {
    mongoose.connection.db.dropDatabase();
    res.send("DB Cleared!");
  } catch (err) {
    res.send(err);
  }
});

//module.exports = app;
