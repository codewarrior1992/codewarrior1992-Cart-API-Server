const router = require('express').Router();
const Carts = require('../models/Cart.js');
const { cartMsg : msg } = require('../helpers/apiMsg.js');
const auth = require('../helpers/auth.js');

// create & update
router.post('/create', async(req,res)=>{
  try{
    let { user, cart } = req.body;
    let curUser = await Carts.find({user});
    
    if(curUser == undefined || curUser.length == 0){
      let document = await Carts({ user,cart }).save();
      res.send({
        status: true,
        document
      })
    } else {
      let data = Object.values([...curUser[0].cart , ...cart]
        .reduce((pre, {title, _id, price, qty}) =>{
        pre[_id] = {
          title,
          _id,
          price,
          qty : (pre[_id] ? pre[_id].qty : 0) + qty
        }
        return pre
      }, {}))
      
      let document = await Carts.findOneAndUpdate(
        { user },
        {$set:{ cart : data }},
        { new : true }
      );

      res.send({
        success : true,
        message : msg.create,
        document
      })
    }
  }catch(err){
    res.status(400).send({err});
  }
})

// get-list
router.get('/getList', auth, async(req,res)=>{
  try{
    let document = await Carts.findOne({ user : req.body.user });
    res.status(200).send({
      success: true,
      document : document || []
    })
  } catch(err){
    res.status(403).send({err})
  }
})

// delete
router.delete('/delete', auth, async(req,res)=>{
  try{
    let { user , product } = req.body;
    console.log(user,product)

    let document = await Carts.updateOne(
      { user },
      { $pull : { cart: { _id : product } }},
      { new : true }
    );

    res.status(200).send({
      success : true,
      message : msg.delete,
      document
    });
  }catch(err){
    res.status(403).send({err});
  }
})

// coupon
router.post('/coupon', auth, (req,res)=>{
  try{
    if (req.body.code === process.env.COUPON_CODE) {
      return res.status(200).send({
        success: true,
        message : msg.coupon_success,
      }) 
    } else {
      return res.status(403).send({
        success: false,
        message : msg.coupon_fail,
      })
    }
  }catch(err){
    res.status(400).send({err})
  }
})

module.exports = router;