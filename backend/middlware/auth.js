const jwt = require('jsonwebtoken')

module.exports = function(req,res,next){
    const token = req.header("Authorization");
    if(!token){
        return res.json({
            mgs: 'you are not login'
        })
    }
    const data = jwt.verify(token,process.env.SECRET_KEY);
    req.user=data
    next()
}