const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');
var mysql = require('mysql');
const { createHash } = require('crypto');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');


app.use(express.json());
app.use(
    cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
    })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userid",
    secret: "random",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}));

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Qwertyuiop1$",
    database:"igse_database",
    multipleStatements: true
});

app.post("/register", (req, res) => {

    const customerid = req.body.customerid;
    const password = hash(req.body.password);
    const address = req.body.address;
    const property_type = req.body.property_type;
    const no_of_bedrooms = req.body.no_of_bedrooms;
    const balance = 200;
    const type = "customer";
    const evc = req.body.voucher;
    const used = 1;

    connection.query("INSERT INTO Customer (customer_id, password_hash, address, property_type, bedroom_num, balance, type) VALUES (?,?,?,?,?,?,?);INSERT INTO Voucher (EVC_code, used) VALUES(?,?);",
    [customerid, password, address, property_type, no_of_bedrooms, balance, type, evc, used],
    (err, result) => {
        console.log(err);
    });
});

app.get("/login", (req,res) => {
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user});
    }else{
        res.send({loggedIn: false});
    }
});

app.post("/login", (req,res) => {

    const customerid = req.body.customerid;
    const password = hash(req.body.password);

    connection.query("Select * FROM Customer WHERE customer_id = ? AND password_hash = ?",
    [customerid,password],
    (err, result) => {
        if(err){
            res.send({err: err});
        }
        if(result.length > 0){
            req.session.user = result;
            // console.log(req.session.user);
            res.send(result);
        }else{
            res.send({message: "Wrong customerid/password combination!"});
        }
    });
});

//Meter Readings submission
app.post("/readings", (req,res) => {

    const submission_date = req.body.submission_date;
    const elec_readings_day = req.body.elec_readings_day;
    const elecs_reading_night = req.body.elecs_reading_night;
    const gas_reading = req.body.gas_reading;
    const status = 'pending';
    const cus = req.session.user[0]['customer_id'];

    connection.query("INSERT INTO Reading(customer_id, submission_date, elec_readings_day, elet_reading_night, gas_reading, status) VALUES (?,?,?,?,?,?)",
    [cus, submission_date, elec_readings_day, elecs_reading_night, gas_reading, status],
    (err, result) => {
        console.log(err);
    });
});


//bills
app.get("/bill", (req,res) => {
    if(req.session.user){
        // console.log("entered");
        const cus_id = req.session.user[0]['customer_id'];
        connection.query("SELECT * FROM igse_database.Reading WHERE customer_id = ? ORDER BY submission_date DESC LIMIT 2;",
        [cus_id],
        (err, result) => {
            if(err){
                res.send({err: err});
            }
            
            if(result.length > 1){
                res.send({billExists: true, newbill: result[0], oldbill:result[1]});
                // console.log(result[0]);
            }
            else{
                res.send({billExists: false});
            }
        });
    }
});


//get tariff
app.get("/tariff", (req,res) => {
    if(req.session.user){
        connection.query("SELECT * FROM igse_database.Taiff;",
        (err, result) => {
            if(err){
                res.send({err: err});
            }
            if(result.length > 0){
                res.send({tariff: result});
                // console.log(result);
            }
        })
    }
});

//get vouchers
app.get("/topup", (req,res) => {
    if(req.session.user){
        connection.query("SELECT * FROM igse_database.Voucher WHERE used = 0",
        (err, result) => {
            if(err){
                res.send({err: err});
            }
            if(result.length > 0){
                res.send({allVouchers: result, user: req.session.user});
                // console.log(req.session.user);
            }
        })
    }
});

// post topup
app.post("/topup", (req,res) => {

    const blanc = req.body.total_balance;
    const custid = req.session.user[0]['customer_id'];
    const vouch = req.body.voucher_num;
    console.log(blanc);
    console.log(custid);
    
    connection.query("UPDATE igse_database.Customer SET balance = ? WHERE customer_id = ?;UPDATE igse_database.Voucher SET used = 1 WHERE EVC_code = ?;",
    [blanc, custid, vouch],
    (err, result) =>{
        if(err){
            res.send({err: err});
        }
        console.log(result);
        res.send(result);
    }
    )
});

// Connecting to database
connection.connect(function(err) {
    if(err){
        console.log("Error in the connection")
        console.log(err)
    }
    else{
        console.log(`Database Connected`)
        connection.query(`SHOW TABLES`,
        function (err, result) {
            if(err)
                console.log(`Error executing the query - ${err}`)
            else
                console.log("Result: ",result)
        })
    }
})


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});