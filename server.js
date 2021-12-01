const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config()

// Middle Ware
app.use(express.json())

// Routes
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');

app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/order', orderRoute);

// Connect DB
mongoose.connect(process.env.DB,()=>{
  app.listen(PORT,()=>{
    console.log(`The server is listening ${PORT} port`);
  })
})