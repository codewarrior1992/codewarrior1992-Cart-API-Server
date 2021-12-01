const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
require('dotenv').config()

// 01. aws-sdk configuring
AWS.config.update({
  secretAccessKey: process.env.Secret_Access_Key, 
  accessKeyId: process.env.Access_Key_Id, 
  region: 'ap-northeast-1'
});

// 02. s3 configuring
const uploadS3 = multer({
  storage: multerS3({
    s3: new AWS.S3({apiVersion: '2006-03-01'}),
    bucket: 'cart-demo-bucket',
    acl:'public-read',
    fileFilter:(req,file,cb)=>{
      var ext = path.extname(file.originalname);
        if(ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg'){
          return cb('file format error')
        }
      },
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, file.originalname );
      },
  })
})

module.exports = uploadS3