const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv/config');


app.use(express.json());
app.use(cors());
app.options('*',cors())

const api = process.env.API_URL

// router connection
const productRouter = require('./routes/products')
const categoryRouter = require('./routes/category')

app.use(api+'/product',productRouter)
app.use(api+'/category',categoryRouter)





app.get('/', (req,res)=>{
    res.send('agfa')
})


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