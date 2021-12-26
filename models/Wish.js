const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  user : {
    type : Object,
    require : true
  },
  wishes : {
    type : Array,
    require : true,
  },
})

module.exports = mongoose.model('wish', wishSchema)