const mysql = require('mysql2');
const inquirer = require("inquirer");
const table = require('console.table');

const db = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: 'root1234',
        database: 'employees_db'
    },
    console.log("Connected to the employees_db database.")
);

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
                viewAllEmployees();
                break;
            case "Add New Employee":
                addNewEmployee();
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

const viewAllEmployees = () =>{
    //See if you can alter the table column from name to department
    db.query(`SELECT employee.first_name AS FirstName,
                     employee.last_name AS LastName,
                     roles.title AS Title,
                     roles.salary AS Salary,
                     department.name AS Department, 
                     CONCAT(manager.first_name, ' ' , manager.last_name) AS Manager
              FROM employee 
              LEFT JOIN roles ON employee.role_id = roles.id 
              LEFT JOIN department ON department.id = roles.department_id 
              LEFT JOIN employee manager ON employee.manager_id = manager.id;
    `, (err,results) => {
        if(err){
            console.error(err);
        }
        else{
            console.table(results);
            initializeQuestions();
        }
    }
)};

const addNewEmployee = () =>{
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the Employee's First Name?",
            name: 'firstName'
        },
        {
            type: 'input',
            message: "What is the Employee's Last Name?",
            name: 'lastName'
        },
        {
            type: 'list',
            message: "What is the Employee's Role with this Company?",
            name: 'role',
            choices: chooseRole()
        },
        {
            type: 'confirm',
            message: "Are they a manager?",
            name: 'manager'
        }
    ])
    .then ((answer) => {
        console.log("Title: " + answer.role);
        let roleID = roleList.indexOf(answer.role) + 1;
        console.log(roleID);
        initializeQuestions();
    });
}

const roleList = [];
const chooseRole = () => {
    db.query("SELECT title FROM roles", (err, roles) => {
        if(err){
            console.error(err);
        }
        else{
            for(var i = 0; i < roles.length; i++){
                roleList.push(roles[i].title);
            }
            roleList.push("Add New Role");
        }
    });
    return roleList;
}