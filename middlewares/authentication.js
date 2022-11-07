const jwt = require("jsonwebtoken");
ACCESS_TOKEN_SECRET = '9a6dfe9d60a4c8e68feb4d02991fb3a23c7a54b5e93cd0bf31e6fbbab2822ca8f1e35da47966780e70e2134fb12e2d635ce787be0507d7ae281d1816715e85cb'


const authenticateUser= (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(token);
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            req.user = user;
            console.log(user);
            next();
        });
    } else {
        res.sendStatus(401);
    }
}
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    //console.log("USER");
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            console.log(user.role);
            if (user.role === "admin"){
                next()
            }
            else{
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {authenticateUser,authenticateAdmin};



