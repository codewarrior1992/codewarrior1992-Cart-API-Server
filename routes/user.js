const router = require('express').Router();
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidataion, loginValidation } = require('../helpers/validation');
const auth = require('../helpers/auth.js');

// Register
router.post('/register', async (req, res) => {
  let { email, password } = req.body;

  // 01. 資料驗證
  let { error } = registerValidataion(req.body);
  if (error) return res.status(403).send({ msg: error.details[0].message });

  // 02. 檢查重複註冊
  let emailExit = await User.findOne({ email });
  if (emailExit) return res.status(403).send(
    {
      success : false,
      message : {
        tw : '帳號已經被註冊',
        en : 'This email has been registered',
        jp : 'This account has been registered'
      }
    }
  );

  // 03. 密碼加密
  let hashPassowrd = await bcrypt.hashSync(password, 10);

  try {
    let user = await User({ email, password: hashPassowrd }).save();
    res.status(201).send({
      success : true,
      message : {
        tw : '帳號註冊成功',
        en : 'Register Success',
        jp : 'アカウント登録の成功'
      },
      data : user
    })
  } catch (err) {
    res.status(400).send(err);
  }
})

// Log in
router.post('/logIn', async (req, res) => {
  let { email, password } = req.body;

  // 01. 資料驗證
  let { error } = loginValidation(req.body);
  if (error) return res.status(403).send({ msg: error.details[0].message });

  // 02. 是否有帳號
  let user = await User.findOne({ email });
  if (!user) return res.status(403).send({
    success : false,
    message : {
      tw : '找不到此帳號',
      en : 'Can not find this account',
      jp : 'このアカウントが見つかりません',
    },
  });

  // 03. 密碼解密
  let hash = user.password;
  let decode = await bcrypt.compareSync(password, hash);
  if (!decode) res.status(403).send({
    success : false,
    message : {
      tw : '密碼錯誤',
      en : 'The password was incorrect',
      jp : 'パスワードが間違っていた',
    },
  });

  // 04. 新增 access_token
  try{
    let token = await jwt.sign({user : user._id} ,process.env.SECRET_CODE,{ expiresIn: 60 * 60 });
    
    user.token = token;
    await user.save()

    res.status(201).send({
      success : true,
      message : {
        tw : '登入成功',
        en : 'Login Success',
        jp : 'ログイン成功'
      },
      user,
    })
    
  } catch(err){
    res.status(400).send(err);
  }
})

// Log out
router.patch('/logOut',async(req,res)=>{
  try{
    let user = await User.findOneAndUpdate(
      { _id : req.body.id},
      { $set : { token:'' } },
      { new : true }
    )
    res.status(200).send({
      success : true,
      message : {
        tw : '登出成功',
        en : 'Log out success',
        jp : 'ログアウト成功'
      },
      user,
    })
  } catch(err){
    res.status(403).send({err})
  }
})

// auth
router.post('/auth', auth, (req,res)=>{
  console.log('user: ', req.user)
})

module.exports = router