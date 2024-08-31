const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    CustomerName:{
        type:String,
        required:true
    },
    InvoiceId:{
        type:Number,
        required:true,
        unique:true
    },
    OrderNumber:{
        type:Number,
    },
    InvoiceDate:{
        type:Date,
        default:Date.now(),
    },
    Terms:{
        type:String,
    },
    DueDate:{
        type:Date,
        defalut:Date.now(),
    },
    SalesPerson:{
        type:String,
    },
    Material:{
        type:String,
    },
    Quantity:{
        type:Number,
    },
    Rate:{
        type:Number,
    },
    Price:{
        type:Number,
    },
    GST:{
        type:Number,
    },
    TotalPrice:{
        type:Number,
    },
    Attachment:{
        type:String,
    }
});

module.exports = mongoose.model("Invoice" , InvoiceSchema);