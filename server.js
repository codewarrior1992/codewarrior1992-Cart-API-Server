const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Middle Ware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// Routes
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');
const cartRoute = require('./routes/cart');
const wishRoute = require('./routes/wish');
const langRoute = require('./routes/lang');

app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/order' , orderRoute);
app.use('/cart' , cartRoute);
app.use('/wish' , wishRoute);
app.use('/lang' , langRoute);

// Connect DB
mongoose.connect(process.env.DB,()=>{
  app.listen(PORT,()=>{
    console.log(`The server is listening ${PORT} port`);
  })
})