const express = require("express");
const Router = express.Router();

const{SignUp , SignIn} = require("../controllers/Auth");
const{auth} = require("../middlewares/auth")

Router.post("/signup" , SignUp);
Router.post("/signin" , SignIn);

module.exports = Router;