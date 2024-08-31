const Invoice = require("../models/Invoice");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const User = require("../models/User");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const { parse } = require('date-fns');

exports.createInvoice = async (req, res) => {
  try {
    // console.log("hello");
    const userId = req.user.id;
    // console.log("YE LOOOOOOOOOOOO USERRRIDDDDDd" , userId);
    // console.log("ye le userId" , userId);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId not found",
      });
    }

    const {
      CustomerName,
      InvoiceId,
      OrderNumber,
      InvoiceDate,
      Terms,
      DueDate,
      SalesPerson,
      Material,
      Rate,
      Price,
      GST,
      TotalPrice,
    } = req.body;

    const document = req.files.Attachment;

    const uploadAttachment = await uploadImageToCloudinary(
      document,
      process.env.FOLDER_NAME
    );

    const parsedInvoiceDate = InvoiceDate
      ? new Date(InvoiceDate.split('/').reverse().join('-')) // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
      : undefined;

      const parsedDueDate = DueDate
      ? new Date(DueDate.split('/').reverse().join('-')) // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
      : undefined;

      if (isNaN(parsedInvoiceDate) || isNaN(parsedDueDate)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Please use DD/MM/YYYY format for dates.",
        });
      }
  

    const newInvoice = await Invoice.create({
      CustomerName,
      InvoiceId,
      OrderNumber,
      InvoiceDate:parsedInvoiceDate,
      Terms,
      DueDate:parsedDueDate,
      SalesPerson,
      Material,
      Rate,
      Price,
      GST,
      TotalPrice,
      Attachment: uploadAttachment.secure_url,
    });

    const pushInvoice = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          Invoice: newInvoice._id,
        },
      },
      { new: true }
    );

    // Generate a PDF of the invoice
    const pdfBuffer = await generateInvoicePDF(newInvoice);

    // Send the PDF via email
    await sendInvoiceEmail(req.user.Email, pdfBuffer,newInvoice);

    return res.status(200).json({
      success: true,
      message: "Invoice created successfully and emailed",
      data: pushInvoice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some error while creating Invoice",
      error: error.message,
    });
  }
};

// Function to generate a PDF using pdfkit
const generateInvoicePDF = (invoice) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Add content to PDF
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.fontSize(12).text(`Customer Name: ${invoice.CustomerName}`);
    doc.text(`Invoice ID: ${invoice.InvoiceId}`);
    doc.text(`Order Number: ${invoice.OrderNumber}`);
    doc.text(`Invoice Date: ${invoice.InvoiceDate}`);
    doc.text(`Terms: ${invoice.Terms}`);
    doc.text(`Due Date: ${invoice.DueDate}`);
    doc.text(`Sales Person: ${invoice.SalesPerson}`);
    doc.text(`Material: ${invoice.Material}`);
    doc.text(`Rate: ${invoice.Rate}`);
    doc.text(`Price: ${invoice.Price}`);
    doc.text(`GST: ${invoice.GST}`);
    doc.text(`Total Price: ${invoice.TotalPrice}`);

    doc.end();
  });
};

// Function to send an email with Nodemailer
const sendInvoiceEmail = async (recipientEmail, pdfBuffer,invoice) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider or SMTP settings
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  // / Define the HTML content with inline CSS for a better look
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        width: 80%;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header h1 {
        margin: 0;
        color: #0066cc;
      }
      .invoice-details {
        margin-bottom: 20px;
      }
      .invoice-details th,
      .invoice-details td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      .total {
        font-weight: bold;
        color: #0066cc;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Invoice</h1>
      </div>
      <table class="invoice-details">
        <tr>
          <th>Customer Name:</th>
          <td>${invoice.CustomerName}</td>
        </tr>
        <tr>
          <th>Invoice ID:</th>
          <td>${invoice.InvoiceId}</td>
        </tr>
        <tr>
          <th>Order Number:</th>
          <td>${invoice.OrderNumber}</td>
        </tr>
        <tr>
          <th>Invoice Date:</th>
          <td>${invoice.InvoiceDate.toDateString()}</td>
        </tr>
        <tr>
          <th>Terms:</th>
          <td>${invoice.Terms}</td>
        </tr>
        <tr>
          <th>Due Date:</th>
          <td>${invoice.DueDate.toDateString()}</td>
        </tr>
        <tr>
          <th>Sales Person:</th>
          <td>${invoice.SalesPerson}</td>
        </tr>
        <tr>
          <th>Material:</th>
          <td>${invoice.Material}</td>
        </tr>
        <tr>
          <th>Rate:</th>
          <td>${invoice.Rate}</td>
        </tr>
        <tr>
          <th>Price:</th>
          <td>${invoice.Price}</td>
        </tr>
        <tr>
          <th>GST:</th>
          <td>${invoice.GST}</td>
        </tr>
        <tr class="total">
          <th>Total Price:</th>
          <td>${invoice.TotalPrice}</td>
        </tr>
      </table>
      <div class="footer">
        <p>Thank you for your business!</p>
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "Your Invoice",
    html:htmlContent,
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};


exports.deleteInvoice = async(req,res)=>{
    try{
        const userId = req.user.id;
       const {invoiceId} = req.body
       if(!invoiceId){
        return res.status(400).json({
            success:false,
            message:"Invalid Invoice"
        });
       }

       await Invoice.findByIdAndDelete(invoiceId);

       await User.updateMany({_id:userId},
        {
            $pull:{
                Invoice:invoiceId,
            }
        },{new:true}
       );

       return res.status(200).json({
        success:true,
        message:"Deletion is successfull"
       });
    }
    catch(error){
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Some error while deleting Invoice",
        error:error.message
      });
    }
};

exports.showAllInvoice = async(req,res)=>{
    try{
       const userId = req.user.id;
       if(!userId ){
         return res.status(400).json({
            success:false,
            message:"User not found"
         });
       }
       

       const showInvoice = await User.findById(userId).populate("Invoice");

       return res.status(200).json({
        success:true,
        message:"All invoices are here",
        data:showInvoice
       });
    }
    catch(error){
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Some error while fetching INVOICES",
        error:error.message
      });
    }
}

