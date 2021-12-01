const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
  try{
    const token = req.headers['authorization'].replace('Bearer ','')
    const decoded = jwt.verify(token, process.env.SECRET_CODE);
    req.user = decoded;
    next();
  } catch(err){
    res.status(401).send({
      success : true,
      message :{
        tw : '請重新登入',
        en : 'Please Login Again',
        jp : 'もう一度ログインしてください'
      },
      err
    })
  }
}