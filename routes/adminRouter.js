//including express module
const express = require('express');
//creating an instance of the express router
const adminRouter = express.Router();
//using layouts module
const ejsLayouts = require('express-ejs-layouts');
//using nodemailer module
const nodemailer = require('nodemailer');

//mail arguments
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user: 'transfast90@gmail.com',
        pass: 'transFAST900!',
    }
});

var mailOptions = {
    from: 'transfast90@gmail.com',
    to: 'ylodonu@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

//adding the layout to the router
adminRouter.use(ejsLayouts);

//route to /dashboard
adminRouter.get('/dashboard',(request,response)=>{
    response.render('dashboard',{data:{title:'Dashboard'}});
});

//route to handle /transactions/day
adminRouter.get('/transactions/:day',(request,response)=>{
    response.render('transaction_details', { data: { title: 'Transaction for ' + request.params.day}});
});

//route to handle /transactions/history
adminRouter.get('/history_transactions', (request, response) => {
    response.render('transaction_details', { data: { title: 'Transaction History'}});
});

//route to handle /daily_sales
adminRouter.get('/daily_sales',(request, response)=>{
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    }); 
});

//making adminRouter global
module.exports = adminRouter; 
