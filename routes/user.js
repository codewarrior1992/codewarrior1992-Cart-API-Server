const router = require('express').Router();
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../helpers/validation/main.js');
const { userMsg : msg } = require('../helpers/apiMsg.js');

// Register
router.post('/register', async (req, res) => {
  try {
    let { email, password } = req.body;

    // 01. 資料驗證
    let { error } = registerValidation(req.body);
    if (error) return res.status(403).send({ message: error.details[0].message });

    // 02. 檢查重複註冊
    let emailExit = await User.findOne({ email });
    if (emailExit) return res.status(403).send(
      {
        success : false,
        message : msg.repeat
      }
    );

    // 03. 密碼加密
    let hashPassowrd = await bcrypt.hashSync(password, 10);

    let user = await User({ email, password: hashPassowrd }).save();
    res.status(201).send({
      success : true,
      message : msg.register,
      user
    })
  } catch (err) {
    res.status(400).send(err);
  }
})

// Log in
router.post('/logIn', async (req, res) => {
  try{
    let { email, password } = req.body;

    // 01. 資料驗證
    let { error } = loginValidation(req.body);
    if (error) return res.status(403).send({ msg: error.details[0].message });

    // 02. 是否有帳號
    let user = await User.findOne({ email });
    if (!user) return res.status(403).send({
      success : false,
      message : msg.unfind
    });

    // 03. 密碼解密
    let hash = user.password;
    let decode = await bcrypt.compareSync(password, hash);
    if (!decode) res.status(403).send({
      success : false,
      message : msg.passErr
    });

    // 04. 新增 access_token
    let token = await jwt.sign({user : user._id} ,process.env.SECRET_CODE,{ expiresIn: 60 * 60 });
    
    user.token = token;
    await user.save()

    res.status(201).send({
      success : true,
      message : msg.logIn,
      user,
    })
  } catch(err){
    res.status(400).send(err);
  }
})

// Log out
router.patch('/logOut', async(req,res)=>{
  try{
    let user = await User.findOneAndUpdate(
      { _id : req.body.id},
      { $set : { token:'' } },
      { new : true }
    )
    res.status(200).send({
      success : true,
      message : msg.logOut,
      user,
    })
  } catch(err){
    res.status(403).send({err})
  }
})

module.exports = router