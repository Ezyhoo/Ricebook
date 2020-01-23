const isLoggedIn = require("./auth").isLoggedIn;

const profileModel = require("./model/model").Profile;

const uploadImage = require("./cloudinaryUpload").uploadImage;

getAllProfile = async (req, res) => {
  res.send(await profileModel.find());
};

// getUsername = (req,res) => {
//     const user  = allProfile.find(user => user.id === parseInt(req.params.userId));
//     res.send({username: user.username});
// }

getHeadLine = async (req, res) => {
  try {
    let username;
    //console.log(req.params.user);
    // if did not specify the user, return the info of loggedIn user
    if (req.params.user === undefined) {
      username = res.locals.loggedInUser.username;
    } else {
        username = req.params.user;
    }
    user = await profileModel.findOne({ username: username });
    if (user === undefined || user === null) {
      res.status("200").send(`Cannot find user ${req.params.user} `);
      return;
    }
    res.send({ username: user.username, headline: user.headline });
  } catch (err) {
    res.send(err);
  }
};

putHeadLine = async (req, res) => {
  try {
    const user = res.locals.loggedInUser;
    //console.log(user);
    const newHeadLine = req.body.headline;
    //res.cookie("loggedInUser", JSON.stringify(user), { maxAge: 3600*1000, httpOnly: true});
    //console.log(await profileModel.findOne({ username: user.username }));
    const updatedUser = await profileModel.findOneAndUpdate(
      { username: user.username },
      { headline: newHeadLine },
      {useFindAndModify: false, new: true}
    );
    res.send({ username: updatedUser.username, newHeadline: updatedUser.headline });
  } catch (err) {
    res.send(err);
  }
};

getEmail = async(req, res) => {
    try {
        let username;
        // if did not specify the user, return the info of loggedIn user
        if (req.params.user === undefined) {
          username = res.locals.loggedInUser.username;
        } else {
            username = req.params.username;
        }
        user = await profileModel.findOne({ username: username });
        if (user === undefined || user === null) {
          res.status("200").send(`Cannot find user ${req.params.user} `);
          return;
        }
        res.send({ username: user.username, email: user.email });
      } catch (err) {
        res.send(err);
      }
};

putEmail = async(req, res) => {
    try {
        const user = res.locals.loggedInUser;
        //console.log(user);
        const newEmail = req.body.email;
        //res.cookie("loggedInUser", JSON.stringify(user), { maxAge: 3600*1000, httpOnly: true});
        //console.log(await profileModel.findOne({ username: user.username }));
        const updatedUser = await profileModel.findOneAndUpdate(
          { username: user.username },
          { email: newEmail },
          {useFindAndModify: false, new: true}
        );
        res.send({ username: updatedUser.username, email: updatedUser.email });
      } catch (err) {
        res.send(err);
      }
    };

getZipcode = async (req, res) => {
    try {
        let username;
        // if did not specify the user, return the info of loggedIn user
        if (req.params.user === undefined) {
          username = res.locals.loggedInUser.username;
        } else {
            username = req.params.username;
        }
        user = await profileModel.findOne({ username: username });
        if (user === undefined || user === null) {
          res.status("200").send(`Cannot find user ${req.params.user} `);
          return;
        }
        res.send({ username: user.username, zipcode: user.zipcode });
      } catch (err) {
        res.send(err);
      }
    };

putZipcode = async (req, res) => {
    try {
        const user = res.locals.loggedInUser;
        //console.log(user);
        const newZipcode = req.body.zipcode;
        //res.cookie("loggedInUser", JSON.stringify(user), { maxAge: 3600*1000, httpOnly: true});
        //console.log(await profileModel.findOne({ username: user.username }));
        const updatedUser = await profileModel.findOneAndUpdate(
          { username: user.username },
          { zipcode: newZipcode },
          {useFindAndModify: false, new: true}
        );
        console.log(updatedUser.zipcode);
        res.send({ username: updatedUser.username, zipcode: updatedUser.zipcode });
      } catch (err) {
        res.send(err);
      }
};

getDOB = async (req, res) => {
    try {
        let username;
        // if did not specify the user, return the info of loggedIn user
        if (req.params.user === undefined) {
          username = res.locals.loggedInUser.username;
        } else {
            username = req.params.username;
        }
        user = await profileModel.findOne({ username: username });
        if (user === undefined || user === null) {
          res.status("200").send(`Cannot find user ${req.params.user} `);
          return;
        }
  /**
    let dob = new Date(user.dob * 1000);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = dob.getFullYear();
    const month = months[dob.getMonth()];
    const day = dob.getDate();
     **/
  res.send({ username: user.username, dob: new Date(user.dob).getTime() });
} catch (err) {
    res.send(err);
  }
};

getAvatar = async(req, res) => {
    try {
        let username;
        // if did not specify the user, return the info of loggedIn user
        if (req.params.user === undefined) {
          username = res.locals.loggedInUser.username;
        } else {
            username = req.params.user;
        }
        user = await profileModel.findOne({ username: username });
        if (user === undefined || user === null) {
          res.status("400").send(`Cannot find user ${req.params.user} `);
          return;
        }
        //console.log(user.avatar);
        res.send({ username: user.username, avatar: user.avatar });
      } catch (err) {
        res.send(err);
      }
    };
putAvatar = async (req, res) => {
    try {
        const user = res.locals.loggedInUser;
        //console.log(user);

        
        const newAvatar = req.body.avatar;
        //res.cookie("loggedInUser", JSON.stringify(user), { maxAge: 3600*1000, httpOnly: true});
        
        const updatedUser = await profileModel.findOneAndUpdate(
          { username: user.username },
          { avatar: newAvatar },
          {useFindAndModify: false, new: true}
        );
        res.send({ username: updatedUser.username, avatar: updatedUser.avatar });
      } catch (err) {
        res.send(err);
      }
};

// uploadImage = (publicId) => (req, res, next) => {
//   multer().single('avatar')(req, res, () =>
//           doUpload(publicId, req, res))
  
// }

// const doUpload = (publicId, req, res) => {
//   //console.log(req);
// 	const uploadStream = cloudinary.uploader.upload_stream(result => {
// 	    // capture the url and public_id and add to the request
//          req.fileurl = result.url
//          req.fileid = result.public_id
//          res.status(200).send({avatar: req.fileurl});
//          //next()
//   }, { public_id: req.body[publicId]})
//   const s = new stream.PassThrough()
// 	s.end(req.file.buffer)
// 	s.pipe(uploadStream);
// 	s.on('end', uploadStream.end)

//     console.log("doUpload done!");
// }



// getUserFromDB = async username => {
//    return await profileModel.findOne({ username: username });
// }
// addProfile = (user) => {
//     //console.log(user);
//     const newUser = {
//         username: user.username,
//         headline: "",
//         email: user.email,
//         zipcode: user.zipcode,
//         dob: user.dob,
//         avatar: "",
//         id: allProfile.length+1,
//     }

//     allProfile.push(newUser);
// }

module.exports = app => {
  app.get("/all-profile", isLoggedIn, getAllProfile);
  //app.get('/username/:user?',isLoggedIn, getUsername)
  app.get("/headline/:user?", isLoggedIn, getHeadLine);
  app.put("/headline", isLoggedIn, putHeadLine);
  app.get("/email/:user?", isLoggedIn, getEmail);
  app.put("/email", isLoggedIn, putEmail);
  app.get("/zipcode/:user?", isLoggedIn, getZipcode);
  app.put("/zipcode", isLoggedIn, putZipcode);
  app.get("/dob/:user?", isLoggedIn, getDOB);
  app.get("/avatar/:user?", isLoggedIn, getAvatar);
  app.post("/new-avatar", isLoggedIn, uploadImage('title', 'avatar'));
  app.put("/avatar", isLoggedIn, putAvatar);
};

//module.exports.addProfile = addProfile;
