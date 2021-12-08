const router = require('express').Router();
const Orders = require('../models/Order.js');
const auth = require('../helpers/auth.js');
const { orderMsg : msg } = require('../helpers/i18n.js');

// create
router.post('/create', auth, async(req,res)=>{
  try{
    let data = req.body;

    let document = await Orders(data).save();

    res.status(201).send({
      success : true,
      message : msg.create,
      document
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
router.get('/getItem', auth, async(req,res)=>{
  try{
    let document = await Orders.findById({_id : req.body.id});

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
router.patch('/update', auth, async(req,res)=>{
  try{
    let document = await Orders.findByIdAndUpdate(
      { _id : req.body.id },
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
router.delete('/delete', auth, async(req,res)=>{
  try{
    let document = await Orders.findOneAndDelete({_id : req.body.id});

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