const router = require('express').Router();
const Orders = require('../models/Order.js');
const Carts = require('../models/Cart.js');
const auth = require('../helpers/auth.js');
const { orderMsg : msg } = require('../helpers/apiMsg.js');

// create
router.post('/create', auth, async(req,res)=>{
  try{   
    let { user, coupon } = req.body;

    let target = await Carts.findOne({user : user._id});

    let calculated = await Carts.aggregate([
      { $match : { user : user._id }},
      { $unwind: "$cart" },
      { 
        $group :{ 
          _id : "$cart._id",
          totalAmount: { $sum: { $multiply: [ "$cart.price", "$cart.qty" ] } },
        }
      },
    ])
    
    let total = calculated.reduce((pre, next) => pre.totalAmount + next.totalAmount);
    console.log(calculated)

    let data = {
      user : user,
      products : target.cart,
      original_price : total,
      discount_price : coupon == true ? total = total * 0.8 : 0,
      coupon : coupon
    }
    let document = await Orders(data).save();

    await Carts.findOneAndRemove({user:user._id});

    res.status(201).send({
      success : true,
      message : msg.create,
      document,
    });
  }catch(err){
    res.status(400).send({err})
  }
})

// get-list
router.get('/getList', auth, async(req,res)=>{
  try{
    let list = await Orders.find({});
    res.status(200).send({
      list
    })
  } catch(err){
    res.status(403).send({err})
  }
})

// get-item
router.get('/getItem/:id', auth, async(req,res)=>{
  try{
    let document = await Orders.findById({_id : req.params.id});

    if(!document) return res.status(403).send({
      success: false,
      message : msg.unfind,
    })

    res.status(200).send({
      success : true,
      document
    })
  }catch(err){
    res.status(403).send({err})
  }
})

// update
router.patch('/update/:id', auth, async(req,res)=>{
  try{
    let document = await Orders.findByIdAndUpdate(
      { _id : req.params.id },
      { $set : { status : req.body.status} },
      { new:false, upsert: false }
    )

    if(!document) return res.status(403).send({
      success: false,
      message : msg.unfind
    })

    let list = await Orders.find({});

    res.status(200).send({
      success : true,
      message : msg.update,
      list,
    })
  }catch(err){
    res.status(400).send({err})
  }
})

// delete
router.delete('/delete/:id', auth, async(req,res)=>{
  try{
    let document = await Orders.findByIdAndDelete({_id : req.params.id});

    if(!document) res.status(403).send({
      success : false,
      message : msg.unfind
    })

    let list = await Orders.find({});

    res.status(200).send({
      success : true,
      message : msg.delete,
      list
    })
  }catch(err){
    res.status(403).send({err})
  }
})

module.exports = router;