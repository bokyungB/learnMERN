const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
//모델 쓰고 싶으면 이렇게 가져와서 쓰면 됨. 
const { auth } = require("./middleware/auth")
const { User } = require("./models/User");

// Routes
const perfumeRouter = require('./routes/perfume');
const perfumeLikeRouter = require('./routes/perfume/like');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/perfume',require('./routes/perfume'))
app.use('/perfume', perfumeRouter);
app.use('/perfume/like', perfumeLikeRouter);

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(()=> console.log('MongoDB Connected...')
                  ).catch(err => console.log(err,'this is not working'))


const port = 5000
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))