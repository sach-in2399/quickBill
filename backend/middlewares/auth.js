const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// authentication
exports.auth = async(req,res,next)=>{
    try{
        // we can access token from body , cookie , headerbearer
        console.log("hello");
       const token = req.body.token;
                      console.log("tttttttttttttoooookeeeeeeen" , token);
        if(!token){
           return res.status(400).json({
            success:false,
            message:"Token is missing",
           });
        }

        // verify token
        try{
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
           return res.status(400).json({
            success:false,
            message:"Issue is invalid",
           });
        }
        next();
    }
    catch{
        return res.status(500).json({
            success:false,
            message:"something went wrong while validating the token",
        });
    }
}
