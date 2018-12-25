//importing express 
const express = require('express');
//creating instance of express
const app = express();
//including path module
const path = require('path');

//defining templating engine as ejs
app.set('view engine', 'ejs');

//defining a middleware to handle request static files
app.use('/public', express.static(path.join(__dirname, 'static')));

//defining router for different routes
//admin requests router
const adminRouter = require('./routes/adminRouter');
app.use('/admin', adminRouter);


//defining general routes
app.get('/', (request,response)=>{
    response.write("welcome to homepage");
    response.send();
});

app.get('/staff_login',(request,response)=>{
    //displaying login page
    response.render('login');
});

app.get('/staff_logout', (request, response) => { });


//defining port to listen to request on.
app.listen(5000);

