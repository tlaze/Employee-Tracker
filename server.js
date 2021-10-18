const mysql = require('mysql2');
const inquirer = require("inquirer");

const db = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: 'root1234',
        database: 'employees_db'
    },
    console.log("Connected to the employees_db database.")
);

//Consoles Each department,role,and employee
// db.query("SELECT * from department", (err,results) => {
//     if(err){
//         console.error(err);
//     }
//     else{
//         console.log(results);
//     }
// });

// db.query("SELECT * from roles", (err,results) => {
//     if(err){
//         console.error(err);
//     }
//     else{
//         console.log(results);
//     }
// });

// db.query("SELECT * from employee", (err,results) => {
//     if(err){
//         console.error(err);
//     }
//     else{
//         console.log(results);
//     }
// });


const initializeQuestions = () =>{
    inquirer.prompt([
        {
            type: 'list',
            message: 'What option would you like to choose?',
            name: 'option',
            choices: [
                "View All Employees?",
                "Add New Employee",
                "Update Employee Role",
                "View All Roles",
                "View All Departments",
                "Add New Department",
                "Quit"
            ]
        }
    ])
    .then ((answer) => {
        console.log(answer.option);
        switch(answer.option){
            case "View All Employees?":
                testPrompts("View All Employees to test");
                break;
            case "Add New Employee":
                testPrompts("Add new to test");
                break;
            case "Update Employee Role":
                testPrompts("Update Role to test");
                break;    
            case "View All Roles":
                testPrompts("View all roles to test");
                break;
            case "View All Departments":
                testPrompts("View Departments to test");
                break;
            case "Add New Department":
                testPrompts("Add new Department to test");
                break;
            case "Quit":
                testPrompts("Quit to test");
                break;                
        }
    });
}

initializeQuestions();

function testPrompts(answer){
    console.log(answer);
    initializeQuestions();
}