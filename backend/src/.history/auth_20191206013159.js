//var model = require("./model/model");
var localUserModel = require("./model/model").localUser;
var googleUserModel = require("./model/model").googleUser;
var profileModel = require("./model/model").Profile;

//const sessionUser = {};
const cookieKey = "sid";
const md5 = require("md5");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const redis = require("redis");
// const bluebird = require("bluebird");
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient(process.env.REDIS_URL);
const keys = require("./keys");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.serializeUser(function(user, done) {
  //console.log("se: " + user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //console.log("de: " + user);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google

      callbackURL: "/auth/google/callback",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    function(accessToken, refreshToken, profile, done) {
      //console.log(profile);
      googleUserModel.findOne({ username: profile.emails[0].value }, function(err,user) {
        //console.log(profile);
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        } else {
          var newGoogleUser = new googleUserModel();
          newGoogleUser.username = profile.emails[0].value;
          newGoogleUser.id = profile.id;
          newGoogleUser.token = accessToken;
          newGoogleUser.name = profile.displayName;

          var newProfile = new profileModel();
          //console.log(profile.emails[0].value);
          (newProfile.username = profile.emails[0].value),
          (newProfile.headline = "A new Ricebook user"),
          (newProfile.following = []),
          (newProfile.zipcode = ""),
          (newProfile.dob = ""),
          (newProfile.email = profile.emails[0].value),
          (newProfile.avatar = profile.photos[0].value);

          newProfile.save(err => {
            if (err) {
              throw err;
            }
          });
          newGoogleUser.save(error => {
            if (error) {
              throw error;
            }

              return done(null, newGoogleUser);
            });
        }
      });
    }
  )
);

client.on("error", function(err) {
  console.log("Error " + err);
});

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

getUsers = async (req, res) => {
  try {
    const users = [
      ...(await localUserModel.find()),
      ...(await googleUserModel.find())
    ];
    res.send({ users });
  } catch (err) {
    res.status(500).send(err);
  }
};

login = async (req, res) => {
  try {
    // get the record from the database by username
    const user = await localUserModel.findOne({ username: req.body.username });
    if (user === null || user === undefined) {
      res.status(401).send("Not allowed! Cannot login!");
      return;
    }
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).send("Not allowed! Cannot login!");
    }
    // "security by obscurity" we don't want people guessing a sessionkey
    const sessionKey = md5(
      getSecretMessage() + new Date().getTime() + user.username
    );
    //sessionUser[sessionKey] = user;
    client.hmset("sessions", sessionKey, JSON.stringify(user), function(err) {
      if (err) throw err;
    });

    // this sets a cookie
    res.cookie(cookieKey, sessionKey, { maxAge: 3600 * 1000, httpOnly: true });

    res.send({ username: user.username, result: "success" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

logout = (req, res) => {
  // the options fields has to be exactly the same with the options when we set cookie
  const sessionId = req.cookies[cookieKey];
  req.logout();
  //sessionUser[sessionId] = "";
  client.hdel("sessions", sessionId, function(err) {
    if (err) throw err;
  });
  res
    .clearCookie(cookieKey, { maxAge: 3600 * 1000, httpOnly: true })
    .send("OK");
};

register = async (req, res) => {
  try {
    const duplicate = await localUserModel.find({
      username: req.body.username
    });
    if (duplicate.length >= 1) {
      res.status(400).send("username already exists");
      return;
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    let user = new localUserModel();
    (user.username = req.body.username),
      (user.salt = salt),
      (user.password = hashedPassword);

    let profile = new profileModel();
    (profile.username = req.body.username),
      (profile.headline = "A new Ricebook user"),
      (profile.following = []),
      (profile.email = req.body.email),
      (profile.dob = req.body.dob),
      (profile.zipcode = req.body.zipcode),
      (profile.avatar =
        "http://content.sportslogos.net/logos/33/813/full/1843_rice_owls-secondary-2017.png");
    await user.save();
    await profile.save();
    res.status(201).send({ result: "success", username: user.username });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

getSecretMessage = () => {
  let message = "";
  const len = Math.floor(Math.random() * 10);
  for (let i = 0; i < len; i++) {
    message += alphabet[Math.floor(Math.random() * 26)];
  }
  return message;
};

getCookie = (req, res) => {
  if (
    req.cookies === undefined ||
    req.cookies[cookieKey] === undefined ||
    req.cookies[cookieKey] === ""
  ) {
    return res.status(400).send("no cookie");
  }
  res.send(req.cookies);
};

updatePassword = async (req, res) => {
  try {
    const user = res.locals.loggedInUser;
    const newPassword = req.body.password;
    const newSalt = await bcrypt.genSalt();
    const newHashedPassword = await bcrypt.hash(newPassword, newSalt);

    const updatedUser = await localUserModel.findOneAndUpdate(
      { username: user.username },
      { salt: newSalt, password: newHashedPassword },
      { useFindAndModify: false, new: true }
    );

    res.send("Changes the password for the logged in user");
  } catch (err) {
    res.send(err);
  }
};

loggedInUser = async (req, res) => {
  if (req.isAuthenticated()) {
    //console.log("In loggedInUser: " + req.user);
    res.send(req.user);
  } else {
    client.hget("sessions", req.cookies[cookieKey], async function(err, user) {
      if (err) {
        throw err;
      }
      if (user === null) {
        res.status(400).send("null");
        return;
      }
      user = JSON.parse(user);
      const loggedInUser = await profileModel.findOne({
        username: user.username
      });
      res.send(loggedInUser);
    });
  }
  //res.send(await profileModel.findOne({ username: "yh75"}));
};
isLoggedIn = async (req, res, next) => {
  if (
    (req.cookies === undefined || req.cookies[cookieKey] === undefined) &&
    !req.isAuthenticated()
  ) {
    res.sendStatus(401);
    return;
  }
  const id = req.cookies[cookieKey];
  if (id === null || (id === "" && !req.isAuthenticated())) {
    res.sendStatus(401);
    return;
  } else if (id !== null && id !== "" && !req.isAuthenticated()) {
    //console.log("No way!!!!!!!!!!");
    client.hget("sessions", req.cookies[cookieKey], async function(err, user) {
      if (err) {
        throw err;
      }
      res.locals.loggedInUser = JSON.parse(user);
      next();
    });
  } else {
    //console.log(`In isLoggedIn: ${req.user}`);
    res.locals.loggedInUser = req.user;
    next();
  }
};

getGoogleClientID = (req, res) => {
  res.status(200).send({ key: keys.google.clientID });
};

googleLogIn = (req, res) => {
  passport.authenticate("google", {
    scope: ["profile"],
    successRedirect: "/main",
    failureRedirect: "/"
  });
};

handleAccountLink = (req, res) => {
  res.locals.linkUser = res.locals.loggedInUser;
  const sessionId = req.cookies[cookieKey];
  req.logout();
  //sessionUser[sessionId] = "";
  client.hdel("sessions", sessionId, function(err) {
    if (err) throw err;
  });
  res.send({url: "/auth/google"});
}

// getGoogleUser = (req, res) => {
//   console.log("req.body: " + req.body);
// };

module.exports = app => {
  app.get("/users", getUsers);
  app.post("/login", login);
  app.put("/logout", isLoggedIn, logout);
  app.get("/cookie", getCookie);
  app.post("/register", register);
  app.put("/password", isLoggedIn, updatePassword);
  app.get("/loggedInUser", loggedInUser);
  app.get("/google-client-ID", getGoogleClientID);
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  app.get("/auth/google/callback", function(req, res, next) {
    passport.authenticate(
      "google",
      {
        successRedirect: "http://ricebook-ezyhoo.surge.sh/main",
        failureRedirect: "http://ricebook-ezyhoo.surge.sh/",
      }
      
    )(req, res, next);
  });

  app.put("/link", handleAccountLink);

  
};

module.exports.isLoggedIn = isLoggedIn;
