const express = require('express');
const router = express.Router();
const multer = require('multer');
const {upload,s3} = require('../s3');

router.post('/upload', upload.single('file'),async function(req,res){
    console.log(req.file);
    res.send("Succesfully uploaded "+req.file.location+ " location")
})

router.get("/listFiles", async (req,res)=> {
    let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
    let x = r.Contents.map(item => item.Key);
    res.send(x)
})















module.exports = router;
