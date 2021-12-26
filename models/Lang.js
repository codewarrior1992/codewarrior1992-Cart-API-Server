const mongoose = require('mongoose');

const langSchema = new mongoose.Schema({
  data : {
    type: Object
  }
})

module.exports = mongoose.model('lang', langSchema)