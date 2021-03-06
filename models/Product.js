const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title : {
    type : String,
    require : true
  },
  category : {
    type : String,
    require : true
  },
  content : {
    type : String,
    require : true
  },
  price : {
    type : Number,
    require : true
  },
  on_sale : {
    type : Number,
  },
  imgUrls:{
    type: Array,
  },
  qty:{
    type : Number,
    default : 1
  }
})

module.exports = mongoose.model('products', productSchema)