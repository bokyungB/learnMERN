const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
//모델 쓰고 싶으면 이렇게 가져와서 쓰면 됨. 
const { auth } = require("./middleware/auth")
const { User } = require("./models/User");
const {Perfume} = require('./models/Perfume');
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(()=> console.log('MongoDB Connected...')
                  ).catch(err => console.log(err,'this is not working'))


app.get('/', (req, res) => res.send('Hello World!안녕안녕'))
app.get('/api/hello',(req,res)=>{
  res.send("안녕하세요~")
})

app.post('/api/product/products',(req,res) => {
  //test 용 조회 정보 api를 만든다. 
  Perfume.find().exec((err,proudctInfo) =>{
    if(err) return res.status(400).json({success:false,err})
    return res.status(200).json({success:true,proudctInfo})
  }
  )

})


app.post('/api/users/register',(req,res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.

  const user = new User(req.body)

  user.save((err,userInfo) =>{
    if(err) return res.json({success:false,err})
    return res.status(200).json({
      success:true
    })
  })

})

app.post('/api/users/login',(req,res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.s
  User.findOne({email: req.body.email},(err,user) =>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message:"입력한 이메일에 해당하는 유저가 없습니s다."
      })
    }
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword( req.body.password , (err,isMatch) =>{
      if(!isMatch)
      return res.json({
        loginSuccess:false, message:"비밀번호가 틀렸습니다."
      })
      // 비밀번호 
      user.generateToken((err,user) => {

      if(err) return res.status(400).send(err);
      
      // token을 저장한다. 어데? 쿠키, 로컬스토리지 ,세션 선택해서
            res.cookie("x_auth",user.token)
            .status(200)
            .json({loginSuccess:true, userId: user._id})

      })
    })
  })
  // 비밀번호까지 맞다면, 토큰을 생성하기
})

app.get('/api/users/auth',auth,(req,res) =>{
  // middle에서는 request 받고, 콜백함수 부르기 전에 작동
  // 여기까지 미들웨어를 통과해 왔다는 것은 authentication == true 
  res.status(200).json({
    _id : req.user._id,
    isAdmin:req.user.roll ===0 ? false:true,
    isAuth: true,
    email: req.user.email,
    name : req.user.name,
    role: req.user.role
  })

}) 

app.get('/api/users/logout',auth,(req,res) =>{
  
  User.findOneAndUpdate({_id:req.user._id},
    {token:""},
    (err,user) =>{
      if(err) return res.json({success:false,err});
      return res.status(200).send({
        success:true

      })
    }

    )
})

const port = 5000
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))