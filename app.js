//importing express 
const express = require('express');
//creating instance of express
const app = express();
//including path module
const path = require('path');
//including body-parser module
const bodyParser = require('body-parser');
//including core module
const core = require('./core');

//using a middleware to allow parsing of urlencoded forms
app.use(bodyParser.urlencoded({ extended: false }));
//defining a middleware to handle request static files
app.use('/public', express.static(path.join(__dirname, 'static')));
//defining templating engine as ejs
app.set('view engine', 'ejs');


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

//route to handle orders
app.post('/make_order',(request,response)=>{
    //referencing joi,db from core module
    let joi = core.joi;
    let db = core.db;
    //creating a JOI scheme to validate customer info
    const customerSchema = joi.object().keys({
        email : joi.string().trim().email().lowercase().required(),
        first_name : joi.string().trim().required(),
        phone_number : joi.string().trim().length(10)
    });
    //pulling customer info into single object
    let customerInfo = {
        email : request.body.email,
        first_name : request.body.first_name,
        phone_number : request.body.phone_number
    };
    //creating a JOI scheme to validate order information
    const orderSchema = joi.object().keys({
        hall : joi.string().trim().required(),
        room_desc: joi.string().trim().required(),
        next_of_kin: joi.string().trim().required(),
        quantity: joi.required(),
        date_to_deliver : joi.string().trim().required(),
        cost: joi.number().required(),
        token: joi.string().trim().required(),
        date_made: joi.string().trim().required(),
        delivery_status: joi.string().trim().required(),
        cust_id: joi.number().required()
    });
    
    //validating customer information
    joi.validate(customerInfo, customerSchema, {escapeHtml:true},(error, result)=>{
        if (error) {
            console.log(error);
            response.send("Invalid info");
        } else {
            let sql = `SELECT * FROM customer WHERE phone_number=${customerInfo.phone_number}`;
            let query = db.query(sql, (error, result) => {
                if (error) {
                    //if query error log it
                    console.log(error);
                    //TODO: route to error page
                    response.send("There was an error"); 
                } else {
                    //customer id
                    let customerId;
                    //if length of result object is 1 or more then info already exits
                    //else store it 
                    if (result.length == 0) {
                        console.log('Customer info not found');
                        let sql = 'INSERT INTO customer SET ?';
                        let query = db.query(sql, customerInfo, (error, res) => {
                            if (error) {
                                console.log(error);
                                //TODO: route to error page
                                response.send("There was an error in saving customer details"); 
                            } else {
                                customerId = res.insertId;
                                console.log('Customer info inserted successfully',res.insertId);
                            }
                        });
                    } else {
                        customerId = result[0].id;
                    }
                    //pulling order info from request body into single object
                    var quantity = request.body.quantity;
 
                    //store order with updated details
                    function storeOrder(cost){
                        //creating order info
                        let orderInfo = {
                            cust_id: customerId, 
                            hall: request.body.hall,
                            next_of_kin: request.body.next_of_kin,
                            room_desc: request.body.room_desc,
                            quantity: request.body.quantity,
                            date_to_deliver: request.body.quantity,
                            cost: cost, 
                            token: core.generateToken(),
                            date_made: '1970-1-1', //TODO:change to current date
                            delivery_status : '0'
                        };

                        //validating order information
                        joi.validate(orderInfo, orderSchema, { escapeHtml: true }, (error, result) => {
                            if (error) {
                                console.log(error);
                                response.send("Invalid order inputs");
                            } else {
                                let sql = 'INSERT INTO product_order SET ?';
                                let query = db.query(sql, orderInfo, (error, result)=>{
                                    if (error) {
                                        console.log(error);
                                        //TODO: route to error page
                                        response.send("There was an error in saving order details");
                                    } else {
                                        response.send("Order details saved successfully with token being "+ orderInfo.token);
                                    }
                                });
                            }
                        });
                    }
                    
                    //calculating cost based on quantity
                    core.calculateCost(quantity, storeOrder);
                }
            });
        }
    });
});

//defining port to listen to request on.
app.listen(5000);

