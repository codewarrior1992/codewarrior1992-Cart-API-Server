const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user : {
    type : String,
    require : true
  },
  cart : {
    type : Array,
    require : true,
  },
})

module.exports = mongoose.model('carts',cartSchema)