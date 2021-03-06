const { User } = require("../models/User");
let auth = (req,res,next) =>{

  //  인증 처리 

  // 클라이언트 쿠키에서 토큰 가져와
  let token = req.cookies.x_auth;

  // 토큰을 복호화 한 후 유저를 찾는다
  User.findByToken(token,(err,user) =>{
    if(err) throw err;
    if(!user) return res.json({isAuth:false,error:true})

    req.token = token;
    req.user = user;
    next()
    // middleware 밖으로 나갈 수 있게
  })

  //유저가 있으면 인증 ok

  // 유저가 없으면 no

}

module.exports = {auth};