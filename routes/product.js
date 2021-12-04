const router = require('express').Router();
const Products = require('../models/Product.js');
const uploadToS3 = require('../helpers/awsS3.js');
const auth = require('../helpers/auth.js');

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
      message :　{
        tw : '已新增產品',
        en : 'The product has been created',
        jp : '製品が作成されました'
      },
      data : document
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
      data : list
    })
  } catch(err){
    res.status(403).send({err})
  }
})

// get-item
router.get('/getItem', async(req,res)=>{
  try{
    let document = await Products.findById({_id : req.body.id});

    if(!document) return res.status(403).send({
      success: false,
      message : {
        tw: '找不到此商品',
        en: 'This product cannot be found',
        jp : 'この商品が見つかりません'
      }
    })
    
    res.status(200).send({
      success : true,
      data : document
    })
  }catch(err){
    res.status(403).send({err})
  }
})

// update
router.patch('/update', auth, async(req,res)=>{
  try{
    let document = await Products.findByIdAndUpdate(
      { _id : req.body.id},       
      { $set: req.body},
      { new : false, upsert : false }
    )

    if(!document) return res.status(403).send({
      success: false,
      message : {
        tw: '找不到此商品',
        en: 'This product cannot be found',
        jp : 'この商品が見つかりません'
      }
    })

    res.status(200).send({
      success:true,
      message : {
        tw : '商品已經更新',
        en : 'The product has been upadted',
        jp : '製品は更新されました'
      },
      data : list
    })
  }catch(err){
    res.status(400).send({err})
  }
})

// delete
router.delete('/delete', auth, async(req,res)=>{
  try{
    let document = await Products.findByIdAndDelete({_id:req.body.id});

    if(!document) res.status(403).send({
      success : false,
      message : {
        tw : '找不到此商品',
        en : 'This product cannot be found',
        jp : 'この商品が見つかりません'
      }
    })

    let list = await Products.find({});

    res.status(200).send({
      success : true,
      message : {
        tw : '商品已經刪除',
        en : 'The product has been deleted',
        jp : '製品が削除されました'
      },
      data : list
    })
  }catch(err){
    res.status(403).send({err})
  }
})

module.exports = router;