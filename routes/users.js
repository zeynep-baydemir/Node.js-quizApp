const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
//const multer = require('multer');
const {upload,s3} = require('../s3');
const {authenticateUser,authenticateAdmin} = require('../middlewares/authentication');
const Image = require('../models/Image');
const redis = require('redis');
require('dotenv').config();



router.get('/',authenticateAdmin,async (req,res) => {
    try{
        const size = req.query.size;
        const page = req.query.page;
        const users=await User.find({},{},{skip:page*size,limit:size}).select('username _id role');
        res.json(users);
    }catch(err){
        res.json({message:err});
    }
});


router.get('/:userId',authenticateUser, async (req,res) => {
    try {
        const user=await User.findById(req.params.userId).select('username _id');
        res.json(user);
    }catch(err){
        res.json(err);
    }
});

router.post('/',authenticateAdmin,async (req,res)=> {
    const bcryptPassword = await bcrypt.hash(req.body.password,10);
    
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: bcryptPassword,
        username: req.body.username,
    });
    try {
        const newUser = await user.save();
        res.json(newUser);
    }catch(err){
        res.json({message:err},err);
    }
});

router.delete('/:userId',authenticateAdmin, async (req,res) =>{
    try{
        const deletedUser = await User.remove({_id: req.params.userId});
        res.json(deletedUser);
    }catch(err){
        res.json({message:err});
    }
});

router.patch('/:userId',authenticateAdmin, async (req,res)=>{
    try{
        const bcryptPassword = await bcrypt.hash(req.body.password,10);
        const updatedUser = await User.updateOne(
            {_id: req.params.userId},
            {$set: {name: req.body.name,
                    surname: req.body.surname,
                    username: req.body.username,
                    email: req.body.email,
                    password: bcryptPassword}
            },
            { runValidators: true });
        res.json(updatedUser);
    }catch(err){
        res.json({message:err});
    };
});

router.post('/upload/:userId', upload.single('file'), async(req,res) => {
    const image = new Image({
        key: req.file.key,
        location: req.file.location
    });
    console.log(image);
    try {
        await image.save();
        console.log("DENEME");
        res.send('Successfull')
    }catch(err){
        res.json({message:err});
    }
});

router.get('/download/:userId',async(req,res)=>{
    const filename = req.params.userId;
    const image = await s3.getObject({Bucket: process.env.BUCKET, Key: filename}).promise();
    res.send(image.Body);

})

router.get('/images',authenticateAdmin,async(req,res)=>{
    try{
        const images = await Image.find().lean();
        res.send(images);

    }catch(err){
        res.json({message:err});
    }
    /*try{
        const i = await s3.listObjectsV2({ Bucket: process.env.BUCKET }).promise();
        let image = i.Contents.map(item => item.Key);
        res.send(image);

    }catch(err){
        res.json({message:err});
    }*/

})
/*router.post('/uplo/:userId',upload.single('file'),async(req,res) => {
    const file = req.file;
    console.log(file);
    const result = await uploadFile(file);
    console.log(result);
    res.send("Succesfully uploaded "+req.file.location+ " location");
})*/



/*
router.patch('/role/:userId',async (req,res)=>{
    try{
        const updatedUser = await User.updateOne(
            {_id: req.params.userId},
            {$set: {role:"admin"}
            },
            { runValidators: true });
        res.json(updatedUser);
    }catch(err){
        res.json({message:err});
    };
});
*/
module.exports = router;
