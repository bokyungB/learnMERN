const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    sns_id: {
        type: String,
        unique: true,
        required: true
    },
    provider: {
        type: String,
        enum: ['google', 'kakao', 'facebook'],
        required: true
    },
    nickname: {
        type: String
    },
    image: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;


// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// //10자리인 salt 생성

// const jwt = require('jsonwebtoken');
// const moment = require("moment");

// const userSchema = mongoose.Schema({
//     name: {
//         type:String,
//         maxlength:50
//     },
//     email: {
//         type:String,
//         trim:true,
//         unique: 1 
//     },
//     password: {
//         type: String,
//         minglength: 5
//     },
//     lastname: {
//         type:String,
//         maxlength: 50
//     },
//     role : {
//         type:Number,
//         default: 0 
//     },
//     image: String,
//     token : {
//         type: String,
//     },
//     tokenExp :{
//         type: Number
//     }
// })

// // index.js user.save() save하기 전에 뭘한다는 것임. mongoose 기능
// // pre가 다 끝나면 user.save가 작동해야함.
// userSchema.pre('save', function( next ) {
//     var user = this;
//     // usser는 위의 userSchema를 가리킴.
//     // 비밀번호를 바꿀때만 암호화해줘야하기 때문에 아래 조건을 걸어줌.
//     if(user.isModified('password')){    
//         // console.log('password changed')
//         bcrypt.genSalt(saltRounds, function(err, salt){
//             if(err) return next(err);
//             // request body를 모델에 넣었으니까,userSchema 에 password를 가져오면 됨. user에 userSchema 할당됨.
//             bcrypt.hash(user.password, salt, function(err, hash){
//                 if(err) return next(err);
//                 user.password = hash 
//                 next()
//             })
//         })
//     } else {
//         next()
//     }
//     //만약에 비밀번호를 바꾸지 않을 때는 next를 해줘야 이 함수에 들어온 이후에 나갈 수 있음. 아니면 이 함수안에 머물게 됨.
// });

// userSchema.methods.comparePassword = function(plainPassword,cb){
//     bcrypt.compare(plainPassword, this.password, function(err, isMatch){
//         if (err) return cb(err);
//         cb(null, isMatch);
//     })
// }

// userSchema.methods.generateToken = function(cb) {
//     var user = this;
//     var token =  jwt.sign(user._id.toHexString(),'secret')
//     var oneHour = moment().add(1, 'hour').valueOf();

//     user.tokenExp = oneHour;
//     user.token = token;
//     user.save(function (err, user){
//         if(err) return cb(err);
//         cb(null, user);
//     })
// }

// userSchema.statics.findByToken = function(token, cb) {
//     var user = this;

//     // 토큰을 decode한다.
//     jwt.verify(token,'secret',function(err, decode){
//         // user._id + '' = token  여기서 ''이 나는 'secret'
//         // decode = userid 유저 아이디를 이용해서 유저를 찾은 다음에
//         // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
//         user.findOne({"_id":decode, "token":token}, function(err, user){
//             if(err) return cb(err);
//             cb(null, user);
//         })
//     })
// }

// const User = mongoose.model('User', userSchema);

// module.exports = { User }