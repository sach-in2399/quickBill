const mongoose = require("mongoose");
require("dotenv").config();

exports.connect= ()=>{
   mongoose.connect(process.env.DATABASE_URL)
   .then(()=>console.log("DB connection is successfull"))
   .catch((error)=>{
    console.log("Db connection failed");
    console.log(error);
    process.exit(1);
   })
   
};