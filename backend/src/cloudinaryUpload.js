const multer = require('multer')
const stream = require('stream')
const cloudinary = require('cloudinary');
const keys = require('./keys');

cloudinary.config({
  cloud_name: keys.cloudinary.cloud_name,
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret,
})

uploadImage = (publicId, name) => (req, res, next) => {
  multer().single(name)(req, res, () =>
          doUpload(publicId, req, res))
}

const doUpload = (publicId, req, res) => {
  //console.log(req);
	const uploadStream = cloudinary.uploader.upload_stream(result => {
	    // capture the url and public_id and add to the request
         req.fileurl = result.url
         req.fileid = result.public_id
         res.status(200).send({image: req.fileurl});
         //next()
  }, { public_id: req.body[publicId]})
  if(req.file === undefined){
    return;
  }
  const s = new stream.PassThrough()
	s.end(req.file.buffer)
	s.pipe(uploadStream);
	s.on('end', uploadStream.end)

    console.log("doUpload done!");
}


module.exports.uploadImage = uploadImage;

