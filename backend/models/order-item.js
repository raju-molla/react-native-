const mongoose = require('mongoose');
const {Schema} = mongoose

const orderItemSchema = new Schema({
    product: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'product',
 
    },
    quantity:{
        type:Number,
        required:true
    }
})


module.exports = mongoose.model('orderItem', orderItemSchema)