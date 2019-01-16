//including express module
const express = require('express');
//creating an instance of the express router
const adminRouter = express.Router();
//using layouts module
const ejsLayouts = require('express-ejs-layouts');

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
    
});

//making adminRouter global
module.exports = adminRouter; 
