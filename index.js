// 'use strict';

const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const { urlencoded } = require('express')

const userRoute = require('./routes/user.js')
const authRoute = require('./routes/auth')
const productsRoute = require('./routes/product')
const orderRoute = require('./routes/order')
const cartRoute = require('./routes/cart')

const app = express();
dotenv.config()

app.use(express.json())
app.use(urlencoded({ extended: false }));



app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/products', productsRoute)
app.use('/api/order', orderRoute)
app.use('/api/cart', cartRoute)


mongoose.set('strictQuery', true)

const MONGO_URL = 'mongodb://127.0.0.1:27017/ecommerce'

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('DB connection successful'))
.catch((error)=> console.log(error.message))


const PORT = 3500

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})
