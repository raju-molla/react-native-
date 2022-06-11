const jwtDecode= require('jwt-decode');

module.exports=function permission(userRole) {
    return function (req,res,next) {
        const token = req.header('Authorization');
        if(!token){
            return res.json({
                mgs: "unauthorized user"
            })
        }

        try{
            let {isAdmin}= jwtDecode(token);
            
             let isIncluded = userRole.includes(isAdmin);
            if(isIncluded) next();
            else {
                next(res.status(401).json({
                    message:"You are not an authorized user"
                }))
            }


        }
        catch(err){
            res.json({
                err
            })
        }
    }
}