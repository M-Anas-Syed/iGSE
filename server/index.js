const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });


var mysql = require('mysql')

var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Qwertyuiop1$",
    database:"igse_database"
})

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