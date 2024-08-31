const mongoose = require("mongoose");

const UserScehma = new mongoose.Schema({
    Username:{
        type:String,
        required:true,
        unique:true,
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        // required:true
    },
    ConfirmPassword:{
        type:String
    },
    Invoice:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Invoice"
    }
    ]
});

module.exports = mongoose.model("User" , UserScehma);