const mysql = require('mysql2');


const db = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: 'root1234',
        database: 'employees_db'
    },
    console.log("Connected to the employees_db database.")
);

db.query("SELECT * from department", (err,results) => {
    if(err){
        console.error(err);
    }
    else{
        console.log(results);
    }
});

db.query("SELECT * from roles", (err,results) => {
    if(err){
        console.error(err);
    }
    else{
        console.log(results);
    }
});

db.query("SELECT * from employee", (err,results) => {
    if(err){
        console.error(err);
    }
    else{
        console.log(results);
    }
});
