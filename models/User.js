const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:{
    type : String,
    require : true
  },
  password:{
    type : String,
    require : true
  },
  token: {
    type: String,
  },
  date:{
    type : Date,
    default : Date.now
  },
})

module.exports = mongoose.model('users',userSchema)