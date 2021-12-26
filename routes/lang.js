const router = require('express').Router();
const Langs = require('../models/Lang.js');
router.get('/',async(req,res)=>{
  try{
    let type = req.body.type;
    let current = {
      "zh-TW" : '61c594b8ca2d039fe80ac8ad',
      "en-US" : '61c59518ca2d039fe80ac8ae',
      "ja-JP" : '61c59e85ca2d039fe80ac8af'
    };
  
    let lang = await Langs.findById({ _id : current[type]});

    res.send({
      success : true,
      lang
    })
  }catch(err){
    res.send({err})
  }
})

module.exports = router