const express = require("express");
const Router = express.Router();

const {createInvoice ,deleteInvoice ,showAllInvoice} = require("../controllers/Invoice");
const{auth} = require("../middlewares/auth");

Router.post("/createInvoice" ,auth,createInvoice);
Router.delete("/deleteInvoice" , auth , deleteInvoice);
Router.get("/showAllInvoice" , auth , showAllInvoice);

module.exports = Router;