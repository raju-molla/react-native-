const Order = require('../models/order');
const OrderItem = require('../models/order-item')

const getOrder = async(req,res)=>{
    try{
        const order = await Order.find().populate('user', "name").sort({'dateOrder':-1});
        if(!order){
             return res.json({
                mgs: "order is empty"
            })
        }
        res.send(order);
    }
    catch(err){
        res.send(err);
    }
}




const getOrderByID = async(req,res)=>{
    try{
        const order = await Order.findById(req.params.id)
        .populate('user', "name")
        .populate(
            {path:"orderItems", populate: 
                {path:"product", populate:"category"}
            })

        if(!order){
             return res.json({
                mgs: "order is empty"
            })
        }
        res.send(order);
    }
    catch(err){
        res.send(err.message);
    }
}



const createOrder = async(req,res)=>{
    try{
        const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            })
            
            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        }))
        
        const orderItemsIdsResolved =  await orderItemsIds;
        // console.log(orderItemsIdsResolved);
    
        
    
        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            user: req.body.user,
        })
        order = await order.save();
    
        if(!order)
        return res.status(400).send('the order cannot be created!')
    
        res.send(order);

    }
    catch(err){
        res.send(err);
    }
}

module.exports ={
    createOrder,
    getOrder,
    getOrderByID
}