const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const InvoiceRoutes  = require("./routes/Invoice");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

database.connect();
    
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:["http://localhost:4000" , "http://127.0.0.1:5500"],
        Credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

cloudinaryConnect();

// routes
app.use("/api/v1/auth" , userRoutes);
app.use("/api/v1/Invoice" , InvoiceRoutes);

app.get("/" , (req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running.....",
    });
})

app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`);
});