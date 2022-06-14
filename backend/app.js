const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv/config');



app.use(express.json());
app.use(cors());
app.use('/public/upload', express.static(__dirname+ '/public/upload/'))
app.options('*',cors())




const api = process.env.API_URL

// router connection
const productRouter = require('./routes/products')
const categoryRouter = require('./routes/category')
const userRouter = require('./routes/user');
const OrderRouter = require('./routes/order')

app.use(api+'/product',productRouter)
app.use(api+'/category',categoryRouter)
app.use(api+'/user',userRouter)
app.use(api+'/order',OrderRouter)



// database connections
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('database connection successfull');
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000, ()=>{
    // console.log(api);
    console.log(`server runing on port http://localhost:3000`);
})