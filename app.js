//importing express 
const express = require('express');
//creating instance of express
const app = express();
//defining templating engine as ejs
app.set('view engine', 'ejs');

//using a middleware that creates an alias for our static files
app.use('/public', express.static(path.join(__dirname, 'static')));

//defining router for different routes
//admin requests router
const adminRouter = require('./routes/adminRouter');
app.use('/admin', adminRouter);


//defining general routes
app.get('/', (request,response)=>{});
app.get('/staff_login',(request,response)=>{});
app.get('/staff_logout', (request, response) => { });


//defining port to listen to request on.
app.listen(5000);

