const inquirer = requirer ("inquirer");
const mysql = requirer ("mysql");
const ctable = requirer ("console.table");

// connecting the database 
const connection = mysql.createConnection({
    host: "localhost",
    port:3306,

//username and password
    user:"root",
    password:"root",
    database:"employee_db"

});

//connect the mySql server and database
connection.connect(function(err){

});

