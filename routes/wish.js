const router = require('express').Router();
const Wishes = require('../models/Wish.js');
const auth = require('../helpers/auth.js');
const { wishMsg : msg } = require('../helpers/apiMsg.js');

// create & update
router.post('/create', auth, async(req,res)=>{
  try{
    let list = await Wishes.findOneAndUpdate(
      { user : req.body.user },       
      { $push: { wishes : req.body.list }},
      { new : true, upsert : true }
    )
    res.status(201).send({
      success: true,
      message: msg.create,
      list
    })
  }catch(err){
    res.status(400).send({err})
  }
})

// remove
router.delete('/delete', auth, async(req,res)=>{
  try{
    let list = await Wishes.updateOne(
      { user : req.body.user },
      { $pull : { wishes: { _id : req.body.product } }},
      { new : true }
    )
    res.status(200).send({
      success : true,
      message: msg.delete,
      list
    })
  }catch(err){
    res.status(403).send({err})
  }
})

module.exports = router;