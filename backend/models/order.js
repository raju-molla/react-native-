const mongoose = require('mongoose');
const {Schema} = mongoose

const orderSchema = new Schema({
    orderItems: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'orderItem',
        required:true
    }],
    shippingAddress1:{
        type:String,
    },
    shippingAddress2:{
        type:String,
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default: "pending"
    },
    totalPrice:{
        type:Number
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    dateOrder:{
        type:Date,
        default:Date.now,
    }

    
})

orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
})
orderSchema.set('toJSON', {
    virtuals:true,
})

module.exports = mongoose.model('Order', orderSchema)