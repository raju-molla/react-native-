const Category = require('../models/category');

const getCat = async(req,res)=>{
    try{
        const category = await Category.find();
        if(!category){
             return res.json({
                mgs: "Category is empty"
            })
        }
        res.send(category);
    }
    catch(err){
        res.send(err);
    }
}

const getByIDCat = async(req,res)=>{
    try{
        const singleCat = await Category.findById(req.params.id);
        if(!singleCat){
            return res.send('category is not find using this id: '+req.params.id);
        }
        res.send(singleCat);
    }
    catch(err){
        res.send(err);
    }
}

const createCat = async(req,res)=>{
    try{
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        })
        let data = await category.save();
        if(!data){
           return res.send("this categoy can not be created!")
        }
        res.send(data);

    }
    catch(err){
        res.send(err);
    }
}

const updateCategory = async(req,res)=>{
    try{
        let categoryUpdate = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color
            },
            {new:true}
        )
        if(!categoryUpdate){
            return res.send("we wont find this category to update")
        }
        res.send(categoryUpdate)
    }
    catch(err){
        res.send(err);
    }
}

const catDelete = async(req,res)=>{
    try{
        const data =await Category.findByIdAndDelete(req.params.id);
        if(!data){
            return res.status(400).json({
                success: false,
                mgs: "category is not  deleted!"
            })
        }
        res.status(200).json({
            success: true,
            mgs: "category is deleted!",
        })
    }
    catch(err){
        res.send(err);
    }
}

module.exports={
    getCat,
    createCat,
    catDelete,
    getByIDCat,
    updateCategory
}