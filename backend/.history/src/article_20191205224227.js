const isLoggedIn = require("./auth").isLoggedIn;
const profileModel = require("./model/model").Profile;
//const userModel = require("./model/model").User;
const postModel = require("./model/model").Post;

const uploadImage = require("./cloudinaryUpload").uploadImage;



getArticle = async (req, res) =>{
    try{
        // if requesting loggedInUser's articles from feed
        if(req.params.id === undefined){
            const loggedInUser = res.locals.loggedInUser;
            let followings = await profileModel.findOne({username: loggedInUser.username}, 'following');
            followings = followings.following;
            const userstoQuery = [loggedInUser.username].concat(followings);
            //console.log(userstoQuery);
            let articles = await postModel.find({author: {$in: userstoQuery}}).sort({date: -1});
            //console.log(articles);
            articles = articles.slice(0,10);
            //console.log(articles);
            res.status(200).send({articles: articles});
        }
        // if requesting an article by id
        else if(req.params.id[0] >= '0' && req.params.id[0] <= '9'){
            const id = parseInt(req.params.id);
            const article = await postModel.findOne({id: id});
                res.status(200).send({article: [article]});
        }
        // if requesting articles from a user by username
        else{
            const username = req.params.id;
            //console.log(articles);
            const followings = await profileModel.find({username: username}, 'following');
            const userstoQuery = [username, followings];
            const articles = await postModel.find({author: {$in: userstoQuery}}).subarray(0, 10);
            res.status(200).send({articles: articles});
        }
    }
    catch(err){
        res.send(err);
    }
}

addArticle = async(req, res) => {
    //console.log(req.body);
    try{
        let newArticle = new postModel();
        newArticle.id = await postModel.countDocuments();
        newArticle.author = res.locals.loggedInUser.username;
        newArticle.body = req.body.text;
        newArticle.date = new Date();
        newArticle.picture = (req.body.image === undefined) ? '' : req.body.image;
        //newArticle.comments = [];

        await newArticle.save();
        res.status(200).send({article: [newArticle]});
    }
    catch(err){
        res.send(err);
    }  
}

updateArticle = async(req, res) => {
    try{
        const id = parseInt(req.params.id);
        const commentId = parseInt(req.body.commentId);
        const loggedInUser = res.locals.loggedInUser;
        let article = await postModel.findOne({id: id});
        //console.log(`article.author: ${article.author}`);
        //console.log(`loggedInUser.username: ${loggedInUser.username}`);
        if(article === null || article === undefined){
            res.status(400).send(`No post with id ${id}`);
            return;
        }
        else if(article.author !== loggedInUser.username && req.body.commentId !== undefined && req.body.commendId != -1){
            res.sendStatus(401)
            return;
        }
        else if(req.body.commentId === undefined){
            article = await postModel.findOneAndUpdate(
                {id: id},
                {body: req.body.text},
                {useFindAndModify: false, new: true}
            );
            //console.log(article);
            res.status(200).send({article: [article]});
        }
        else{
            let article = await postModel.findOne({id: id});
            let comments = article.comments;
            if(commentId === -1){
                const newComment = {commentId: loggedInUser.username +  Date.now(), author: loggedInUser.username, body: req.body.text, date: new Date()}
                comments.push(newComment);
                //console.log(`comments: ${comments}`);
                article = await postModel.findOneAndUpdate(
                    {id: id},
                    {comments: comments},
                    {useFindAndModify: false, new: true}
                )
                //console.log(article);
                res.status(200).send({article: [article]});

            }else{
                //console.log("Not -1");
                let comment;
                let idx = -1;
                for(let i = 0; i < comments.length; i++){
                    if(comments[i].commentId === commentId){
                        comment = comments[i];
                        idx = i;
                        break;
                    }
                }
                if(idx === -1){
                    res.status(400).send(`No commentId with ${commentId}`);
                    return;
                }
                comments[idx].body = req.body.text; 
                if(comment.author !== loggedInUser.username){
                    res.sendStatus(401);
                }
                else{
                    artcile = await postModel.findOneAndUpdate(
                        {id: id},
                        {comments: comments},
                        {useFindAndModify: false, new: true}
                    );
                    res.status(200).send({article: [article]});
                }
            }
        }
        
    }
    catch(err){
        res.send(err);
    }
}

// uploadImage = (publicId) => (req, res, next) => {
//     multer().single('image')(req, res, () =>
//             doUpload(publicId, req, res))
    
//   }
  
//   const doUpload = (publicId, req, res) => {
//     //console.log(req);
//       const uploadStream = cloudinary.uploader.upload_stream(result => {
//           // capture the url and public_id and add to the request
//            req.fileurl = result.url
//            req.fileid = result.public_id
//            res.status(200).send({image: req.fileurl});
//            //next()
//     }, { public_id: req.body[publicId]})
//     const s = new stream.PassThrough()
//       s.end(req.file.buffer)
//       s.pipe(uploadStream);
//       s.on('end', uploadStream.end)
  
//       console.log("doUpload done!");
//   }

module.exports = app => {
    app.get("/articles/:id?",isLoggedIn, getArticle);
    app.put("/articles/:id", isLoggedIn, updateArticle);
    app.post("/new-image", isLoggedIn, uploadImage('title', 'image'));
    app.post("/articles/", isLoggedIn, addArticle);
  };
