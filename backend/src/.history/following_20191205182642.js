const isLoggedIn = require("./auth").isLoggedIn;

const profileModel = require("./model/model").Profile;

getFollowing = async(req, res) => {
    let username;
    if(req.params.user === undefined){
        username = res.locals.loggedInUser.username;
    }
    else{
        username = req.params.user;
    }
    //console.log(username);
    const user = await profileModel.findOne({username: username});
    if(user === null || user === undefined){
        res.status(400).send(`Cannot find user: ${username}`);
    }
    else{
        res.send({username: username, following: user.following})
    }
}

addFollowing = async(req, res) => {
    const loggedInUser = res.locals.loggedInUser;
    //console.log(res.locals);
    const user = await profileModel.findOne({username: loggedInUser.username});
    if(user.following.includes(req.params.user)){
        res.status(400).send(`You have already followed ${req.params.user}`);
        return;
    }
    const updatedUser = await profileModel.findOneAndUpdate(
        {username: loggedInUser.username},
        {following: user.following.concat(req.params.user)},
        {useFindAndModify: false, new: true}
        )
    console.log(updatedUser.following);
    res.status(200).send({username: loggedInUser.username, following: updatedUser.following});
}

deleteFollowing = async(req, res) => {
    const loggedInUser = res.locals.loggedInUser;
    const user = await profileModel.findOne({username: loggedInUser.username});
    const newFollowing = user.following.filter(f => f !== req.params.user);
    if(newFollowing.length === user.following.length){
        res.status(400).send(`${req.params.user} is not in the following`);
        return;
    }
    const updatedUser = await profileModel.findOneAndUpdate(
        {username: loggedInUser.username},
        {following: newFollowing},
        {useFindAndModify: false, new: true}
        )
    res.status(200).send({username: loggedInUser.username, following: updatedUser.following});

}


module.exports = app => {
    app.get("/following/:user?", isLoggedIn, getFollowing);
    app.put("/following/:user", isLoggedIn, addFollowing);
    app.delete("/following/:user", isLoggedIn, deleteFollowing)
  };
