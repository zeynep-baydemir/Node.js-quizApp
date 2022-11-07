require('dotenv').config();
const aws = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3-v2');


const bucket = process.env.BUCKET;

//console.log(process.env.BUCKET_REGION);
//console.log(process.env.ACCESS_KEY);
//console.log(process.env.SECRET_KEY);


aws.config.update({
  region : process.env.BUCKET_REGION,
  accessKeyId : process.env.ACCESS_KEY,
  secretAccessKey : process.env.SECRET_KEY
})

const s3 = new aws.S3();


//console.log(aws.config);



const upload = multer({
  storage:multers3({
    s3:s3,
    bucket: bucket,
    key: function(req,file,cb){
      console.log(file);
      cb(null, req.params.userId);
    }
  })
});


module.exports = {upload,s3};