const Product = require('../models/productSchema.js');
const Category = require('../models/category');
const mongoose = require('mongoose');

// create a product 
const createProduct = async (req,res)=>{
    try{
        let data = await Category.findById(req.body.category);
        if(!data){
            return res.status(400).send("invalid")
        }

        let product = new Product({
            name:req.body.name,
            description: req.body.description,
            richDescription:req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
            
        })
        product = await product.save();
        if(!product){
            return res.status(500).json({
                mgs: "product is not created!"
            })
        }
        return res.status(200).json({
            product
        })
    }
    catch(err){
        res.send(err )
    }
        
   
    
}

// get all product 
const getAllProduct = async(req,res)=>{
    try{
        const product = await Product.find().populate('category');
        if(!product){
            res.status(400).json({
                mgs: "no product"
            })
        }
        else{
            res.status(200).json({
                product
            })
        }
    }
    catch(err){
        console.log(err);
    }
}


const getById = async(req,res)=>{
    try{
        let product = await Product.findById(req.params.id).populate('category');
        if(!product){
            return res.status(400).json('invalid id')
        }
        return res.status(200).json(product)
    }
    catch(err){
        res.send(err)
    }
}

const productUpdate = async(req,res)=>{
    try{
        let data = await Category.findById(req.body.category);
        if(!data){
            return res.status(400).send("invalid")
        }

        let product = await Product.findByIdAndUpdate(
            req.params.id,
             {
                name:req.body.name,
                description: req.body.description,
                richDescription:req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            
            },
            {new:true}
        
        )
        product = await product.save();
        if(!product){
            return res.status(500).json({
                mgs: "product is not updated!"
            })
        }
        return res.status(200).json({
            mgs:'product updated successfully',
            product,
        
        })
    }
    catch(err){
        res.send(err )
    }
        
    
}


module.exports={
    createProduct,
    getAllProduct,
    getById,
    productUpdate
}