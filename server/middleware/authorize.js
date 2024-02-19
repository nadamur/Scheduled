const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req,res,next) {
    //get token from header
    const token = req.header('jwt_token');
    //check if token does not exist
    if (!token){
        return res.status(403).json({msg:"Authorization denied"});
    }
    //if token exists, verify it
    try{
        //storeID is stored in token payLoad as 'user'
        const verify = jwt.verify(token, process.env.jwtSecret);
        req.user = verify.user;
        //move on if token is verified
        next();
    }catch(err){
        res.status(401).json({msg:"Token not valid"})
    }
}