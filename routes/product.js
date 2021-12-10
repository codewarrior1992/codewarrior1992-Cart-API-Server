const router = require('express').Router();
const Products = require('../models/Product.js');
const uploadToS3 = require('../helpers/awsS3.js');
const auth = require('../helpers/auth.js');
const { productMsg : msg } = require('../helpers/i18n.js');

// create
router.post('/create', auth , uploadToS3.array('photos', 5) , async(req,res)=>{
  try{
    let formData = req.body;
    let files = req.files;
    let imgUrls =  files.map((file)=>  file.location );
    formData.imgUrls = imgUrls;

    let document = await Products(formData).save()

    res.status(201).send({
      success: true,
      message : msg.create,
      document
    })
  }catch(err){
    res.status(400).send({err})
  }
})

// get-list
router.get('/getList', async(req,res)=>{
  try{
    let list = await Products.find({});
    res.status(200).send({
      success: true,
      list
    })
  } catch(err){
    res.status(403).send({err})
  }
})

// get-item
router.get('/getItem/:id', async(req,res)=>{
  try{
    let document = await Products.findById({_id : req.params.id});

    if(!document) return res.status(403).send({
      success: false,
      message : msg.unfind
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
    let list = await Products.find({})
    let document = await Products.findByIdAndUpdate(
      { _id : req.body.id},       
      { $set: req.body},
      { new : false, upsert : false }
    )

    if(!document) return res.status(403).send({
      success: false,
      message : msg.unfind
    })

    res.status(200).send({
      success:true,
      message : msg.update,
      list
    })
  }catch(err){
    console.log(err);
    res.status(400).send({err})
  }
})

// delete
router.delete('/delete', auth, async(req,res)=>{
  try{
    let document = await Products.findByIdAndDelete({_id:req.body.id});

    if(!document) res.status(403).send({
      success : false,
      message : msg.unfind
    })

    let list = await Products.find({});

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