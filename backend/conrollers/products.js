const Product = require('../models/productSchema.js');
const Category = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer')

// for images






// create a product 
const createProduct = async (req,res)=>{
    try{
        let data = await Category.findById(req.body.category);
        
        if(!data){
            return res.status(400).send("invalid")
        }
        if(!req.file){
            return res.status(404).json('empty file')
        }
        const fileName=  req.file.filename;
        

        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
        let product = new Product({
            name:req.body.name,
            description: req.body.description,
            richDescription:req.body.richDescription,
            image: `${basePath}${fileName}`,
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
        let filter= {};
        if(req.query.categories){
            filter= {category: req.query.categories.split(',')};
        }
        const product = await Product.find(filter).populate('category');
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
        res.send(err);
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

        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json('product is empty')
        }
        const file = req.file;
        let imagePath;
        if(file){
            const fileName=  req.file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
            imagePath=`${basePath}${fileName}`
        }
        else{
            imagePath = product.image
        }

        let updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
             {
                name:req.body.name,
                description: req.body.description,
                richDescription:req.body.richDescription,
                image: imagePath,
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
        updateProduct = await product.save();
        if(!updateProduct){
            return res.status(500).json({
                mgs: "product is not updated!"
            })
        }
        return res.status(200).json({
            mgs:'product updated successfully',
            updateProduct,
        
        })
    }
    catch(err){
        res.send(err )
    }
}


const GallaryImages = async(req,res)=>{
    try{
    
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
        
        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true }
        );

        if (!product) return res.status(500).send('the gallery cannot be updated!');

        res.send(product)
    }
    catch(err){
        res.send(err);
    }
}


const productDelete = async(req,res)=>{
    try{
        const data =await Product.findByIdAndDelete(req.params.id);
        if(!data){
            return res.status(400).json({
                success: false,
                mgs: "Product is not  find to delete!"
            })
        }
        res.status(200).json({
            success: true,
            mgs: "Product is deleted!",
        })
    }
    catch(err){
        res.send(err);
    }
}

const countProduct = async(req,res)=>{
    try{
        const productCount = await Product.countDocuments();
        if(!productCount){
            res.status(500).json({
                "productCount" : 0
            })
        }
        return res.json({
            "productCount": productCount
        })
        
    }
    catch(err){
        res.send(err.message);
    }
}

const isFeaturedProduct = async(req,res)=>{
    try{
        const count = req.params.count? req.params.count:0;
        const product = await Product.find({isFeatured:true}).limit(+count);
        if(!product){
            return res.status(500).json({
                mgs: "product is not fount!"
            })
        }
        return res.status(200).json({
            product
        })

    }
    catch(err){
        res.send(err.message);
    }
}


module.exports={
    createProduct,
    getAllProduct,
    getById,
    productUpdate,
    productDelete,
    countProduct,
    isFeaturedProduct,
    GallaryImages
}