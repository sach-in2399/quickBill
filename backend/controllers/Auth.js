const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.SignUp = async(req,res)=>{
    try{
      const {Username , Email , Password , ConfirmPassword} = req.body;

      if(!Username || !Email || !Password ||!ConfirmPassword){
        return res.status(400).json({
            success:false,
            message:"All fields are mandotary"
        });
      }

      if(ConfirmPassword !== Password){
        return res.status(400).json({
            success:false,
            message:"Confirm password is not matched",
        });

      }

      const existingUser = await User.findOne({Username});
      console.log("ye le lo" , existingUser);
      if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User already exist",
        });
      }

      const hashedPassword = await bcrypt.hash(Password,10);

      const UserDetails = await User.create({
        Username,
        Email,
        Password:hashedPassword
      });

      return res.status(200).json({
        success:true,
        message:"User signedUp successfully",
        data:UserDetails
      });
    }
    catch(error){
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Some error while signedUp",
        error:error.message
      })
    }
};

exports.SignIn = async(req,res)=>{
    try{ 
        const {Username , Password} = req.body;

        if(!Username || !Password){
          return res.status(400).json({
            success:false,
            message:"All fields are mandatory",
          });
        }

        const user = await User.findOne({Username});
        if(!user){
          return res.status(400).json({
            success:false,
            message:"User not registered , go first signup"
          });
        }

        if(await bcrypt.compare(Password , user.Password)){
            const payload = {
                Email:user.Email,
                Username:user.Username,
                id:user._id
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"});
            user.token = token;
            user.Password = undefined;

            // create cookie
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }

              res.cookie("token" , token , options).status(200).json({
              success:true,
              message:"User logged in successfully",
              token,
              user
            });
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Some error while signIn",
            error:error.message
        })

    }
};