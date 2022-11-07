const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const path = require('path')



const auth = express();

const User = require('../models/User');
auth.use('/', express.static(path.join(__dirname, 'static')))

ACCESS_TOKEN_SECRET = '9a6dfe9d60a4c8e68feb4d02991fb3a23c7a54b5e93cd0bf31e6fbbab2822ca8f1e35da47966780e70e2134fb12e2d635ce787be0507d7ae281d1816715e85cb'
JWT_SECRET = 'lsanl/(afblfef#aghjk41.6&sa*flalas/23*66f?aglh';
REFRESH_TOKEN_SECRET = 'c7e1e5ee1e9deec0169d75c0e07d2a559a2a90ea88f5cdac3724626928f600122810dcf29b66188c5d438a59233921a2b4840404deaec4e03b237b7a4b6b9895'
const refreshTokens = [];

router.post('/register', async (req,res)=> {
    const {username, password: plainTextPassword} =req.body;
    if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}
	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}
    if (plainTextPassword.length < 6){
        return res.json({
            status:'error',
            error: 'Password should be at least 6 characters.'
        })
    }
    const password = await bcrypt.hash(plainTextPassword,10);
    
    try{
        const user = await User.create({
            username,
            password
        })
        const token = jwt.sign({id: user._id, username, role: user.role}, JWT_SECRET);

    }catch(err){
        if (err.code === 11000) {
			return res.json({ status: 'error', err: 'Username already in use' });
		}
		return res.status(400).json({message: "User not created", error: err.message});
    };    
    res.status(201).json({message: "User is succesfully created"});
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await User.findOne({username}).lean();
        if(!user) {
            return res.json({status:'error', error: 'Invalid username'})
        }
        if(await bcrypt.compare(password, user.password)){
            const accessToken = jwt.sign({id: user._id, username, role:user.role},ACCESS_TOKEN_SECRET);
            const refreshToken = jwt.sign({ username: user.username, role: user.role }, REFRESH_TOKEN_SECRET);
       
            refreshTokens.push(refreshToken);
    
            res.json({
                accessToken,
                refreshToken
            });
        } else {
            res.send('Username or password incorrect');
        }
    }catch(err){
        res.json({message:err});
    }   
   
    
});




module.exports = router;
