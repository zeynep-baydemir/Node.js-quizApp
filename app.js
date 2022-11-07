const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const app = express();

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'static')))

app.listen(8090);
const userRoute = require('./routes/users');
const quizRoute = require('./routes/quizzes');
const authRoute = require('./routes/auth');
const changeRoute =  require('./routes/change');
const uploadRoute = require('./routes/uploadFiles');


app.use('/users', userRoute);
app.use('/quizzes', quizRoute);
app.use('/', uploadRoute);


app.route('/register').post(authRoute);
app.route('/login').post(authRoute);
app.route('/change-password').post(changeRoute);
app.route('/updateRole/:userId').patch(authRoute);

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true},()=>{
    console.log('connected to mongodb')
})

