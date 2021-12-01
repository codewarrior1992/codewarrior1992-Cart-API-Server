const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user : {
    type : Object,
    require : true
  },
  products:{
    type : Array,
    require:true
  },
  original_price : {
    type : Number,
    require : true,
  },
  discount_price : {
    type : Number,
  },
  coupon:{
    type : Boolean,
    default:false
  },
  status : {
    type : Boolean,
    default:true
  },
  date : {
    type: Date,
    default : Date.now
  }
})

module.exports = mongoose.model('orders', orderSchema)
