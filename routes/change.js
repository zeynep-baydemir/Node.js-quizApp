const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const path = require('path')

const out = express();
const JWT_SECRET = 'lsanl/(afblfef#aghjk41.6&sa*flalas/23*66f?aglh';

const User = require('../models/User');
out.use('/', express.static(path.join(__dirname, 'static')))
router.post('/change-password', async (req,res) => {
    const {token,newpassword} = req.body;
    try{
        console.log(newpassword);
        const user = jwt.verify(token,JWT_SECRET);
        console.log("verified");
        const _id = user.id;
        console.log(user);
        const password = await bcrypt.hash(newpassword,10);
        console.log(password);
        console.log("test1");
        await User.updateOne(
            {_id},
            {$set: {password}}
        )
        console.log("test2");
        res.json({status:'ok'});
    }catch(error){
        res.json({status:'error', error:''})
    } 
})
module.exports = router;
