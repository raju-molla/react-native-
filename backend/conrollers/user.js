const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

// get all user
const allUser = async(req,res)=>{
    try{
        let user = await User.find().select('-password');
        if(!user){
            return res.status(400).json("user is not found");
        }
        return res.status(200).json({
            user
        })
    }
    catch(err){
        return res.json(err);
     }
}

// get single user

const singleUSer = async(req,res)=>{
    try{
        let user = await User.findById(req.params.id).select("-password");
        if(!user){
            return res.status(400).json({
                mgs: "user is not find"
            })
        }
        return res.status(200).json({
            user
        })
    }
    catch(err){
        res.send(err)
    }
}


// register
const createAccount = async(req,res)=>{
    try{
        let user = new User({
            name: req.body.name,
            email:req.body.email,
            phone: req.body.phone,
            password: await bcrypt.hash(req.body.password,10),
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        })

        let newUser = await user.save();
        if(newUser){
            return res.status(200).json({
                mgs: "user create successfully",
                newUser
            })
        }
        else{
            return res.status(500).json({
                success: false
            })
        }
    }
    catch(err){
       return res.json(err);
    }
}

const login = async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email});
        if(user){
            
            const isValid = await bcrypt.compare(password,user.password);
            
            if(isValid){
                const data={
                    id:user.id,
                    isAdmin: user.isAdmin
                }
                const token = jwt.sign(data,process.env.SECRET_KEY, {expiresIn: "5d"});
                return res.json({
                    email: user.email,
                    token
                })

            }
            else{
                return res.json({
                    mgs: "password is not matched"
                })
            }


    }
        else{
            return res.json({
                mgs: 'email is not matched!'
            })
        }
    }

    catch(err){
        return res.json({
            err
        })
    }
}

const updateUser = async(req,res)=>{
    try{
        const userExist = await User.findById(req.params.id);
        let newPassword
        if(req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10)
        } else {
            newPassword = userExist.passwordHash;
        }
    
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                passwordHash: newPassword,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country,
            },
            { new: true}
        )
    
        if(!user)
        return res.status(400).send('the user cannot be created!')
    
        res.send(user);
    }
    catch(err){
        res.status(500).json(err)
    }
}


const countUser = async(req,res)=>{
    try{
        const UserCount = await User.countDocuments();
        if(!UserCount){
            res.status(500).json({
                "UserCount" : 0
            })
        }
        return res.json({
            "UserCount": UserCount
        })
        
    }
    catch(err){
        res.send(err.message);
    }
}


const userDelete = async(req,res)=>{
    try{
        const data =await User.findByIdAndDelete(req.params.id);
        if(!data){
            return res.status(400).json({
                success: false,
                mgs: "USer is not  find to delete!"
            })
        }
        res.status(200).json({
            success: true,
            mgs: "User is deleted!",
        })
    }
    catch(err){
        res.send(err);
    }
}


module.exports={
    createAccount,
    allUser,
    singleUSer,
    login,
    countUser,
    userDelete,
    updateUser
}