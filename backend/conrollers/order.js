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
        
        const totalPrices=await Promise.all(orderItemsIdsResolved.map(async(ele)=>{
           const product = await OrderItem.findById(ele).populate('product','price');
            const totalPrice = product.product.price* product.quantity;
            return totalPrice
           
        }))
        const totalPrice = totalPrices.reduce((a,b)=>a+b,0);

        console.log(totalPrice);
        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            totalPrice:totalPrice,
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


const orderUpdate = async(req,res)=>{
    try{
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {
                new:true
            }
        )
        if(!order){
            res.status(404).json({
                mgs: "order is not found"
            })
        }
        res.status(200).json({
            order
        })
    }
    catch(err){
        res.send(err)
    }
}


const orderDelete = async(req,res)=>{
    try{
        
        const order = await Order.findByIdAndDelete(req.params.id)
        if(!order){
            res.status(404).json({
                status: false,
                mgs: "order is not delete"
            })
        }
        else{
            const orderItemId = order.orderItems;
            await orderItemId.map(async(ele)=>{
                await OrderItem.findByIdAndDelete(ele);
            })
            
            res.status(200).json({
                status: true,
                mgs: "order is deleted!"
            })
        }
    }
    catch(err){
        res.send(err)
    }
}


const totalSales = async(req,res)=>{
    try{
        const order = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalPrice: {$sum:"$totalPrice"}
                }
            }
        ])
        if(!order){
            return res.status(404).json('order is not found')
        }
        else{
            return res.status(200).json({
                totalSales: order.pop().totalPrice
            })
        }
    }
    catch(err){
        res.send(err)
    }
}

const orderCount = async(req,res)=>{
    try{
        const totalOrder = await Order.countDocuments();
        if(!totalOrder){
            return res.status(404).json('order is not found')
        }
        else{
            return res.status(200).json({
                orderCount: totalOrder
            })
        }
    }
    catch(err){
        res.send(err);
    }
}


const userOrder = async(req,res)=>{
    try{    
        const userOrder = await Order.find({user:req.params.id}).populate({
            path:'orderItems', populate:({
                path: "product", populate: 'category'
            })
        }).sort({'dateOrder':-1});

        if(!userOrder){
            return res.status(404).json("userOrder is not found")
        }
        else{
            return res.status(200).json({
                userOrder
            })
        }
    }
    catch(err){
        res.json(err.message)
    }
}

module.exports ={
    createOrder,
    getOrder,
    getOrderByID,
    orderUpdate,
    orderDelete,
    totalSales,
    orderCount,
    userOrder
}