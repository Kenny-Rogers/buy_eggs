//using nodemailer module
const nodemailer = require('nodemailer');
//using mysql module
const mysql = require('mysql');
//using joi module
const joi  = require('joi');

//creating connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'eggs_project'
});

//connecting
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('mysql connected...');
});


//mail arguments
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
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

//code to send mail

// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// }); 

//generates user token
function generateToken(){
    var token = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let strlen = chars.length;

    for(let i = 0; i < 6; i++){
        let index = Math.floor(Math.random() * strlen);
        token += chars.charAt(index);
    }

    console.log('Token generated ' + token);

    return token;
}

//calculate cost of orders
function calculateCost(quantity, callback){
    console.log('Quantity  is '+ quantity);
    let results = 0;
    let sql = 'SELECT * FROM unit_price WHERE unit=1';
    let query = db.query(sql, (error,result)=>{
        if(error){
            console.log('Error: failed to retrieve unit price');
        } else {
            cost = result[0].price * quantity;
            //return results;
           callback(cost);
        }
    });
}


module.exports = {
    transporter : transporter,
    db : db,
    joi : joi,
    generateToken : generateToken,
    calculateCost : calculateCost
};