const router = require('express').Router();
const Orders = require('../models/Order.js');

// create
router.post('/create', async(req,res)=>{
  try{
    let data = req.body;

    let document = await Orders(data).save();

    res.status(201).send({
      success : true,
      message :{
        tw : '訂單建立成功',
        en : 'The order is created successfully',
        jp : '注文が正常に作成されました'
      },
      data : document
    });
  }catch(err){
    res.status(400).send({err})
  }
})

// get-list
router.get('/getList', async(req,res)=>{
  try{
    let orders = await Orders.find({});
    res.status(200).send({
      orders
    })
  } catch(err){
    res.status(403).send({err})
  }
})

// get-item
router.get('/getItem', async(req,res)=>{
  try{
    let document = await Orders.findById({_id : req.body.id});

    if(!document) return res.status(403).send({
      success: false,
      message : {
        tw: '找不到此訂單',
        en: 'This order cannot be found',
        jp : 'この注文が見つかりません'
      }
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
router.patch('/update', async(req,res)=>{
  try{
    let document = await Orders.findByIdAndUpdate(
      { _id : req.body.id },
      { $set : { status : req.body.status} },
      { new:false, upsert: false }
    )

    if(!document) return res.status(403).send({
      success: false,
      message : {
        tw: '找不到此訂單',
        en: 'This order cannot be found',
        jp : 'この注文が見つかりません'
      }
    })

    let list = await Orders.find({});

    res.status(200).send({
      success : true,
      message :{
        tw : '訂單更新成功',
        en : 'Order updated successfully',
        jp : '注文が正常に更新されました'
      },
      data : list,
    })
  }catch(err){
    res.status(400).send({err})
  }
})

// delete
router.delete('/delete', async(req,res)=>{
  try{
    let document = await Orders.findOneAndDelete({_id : req.body.id});

    if(!document) res.status(403).send({
      success : false,
      message : {
        tw : '找不到此訂單',
        en : 'This order cannot be found',
        jp : 'この注文が見つかりません'
      }
    })

    let list = await Orders.find({});

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