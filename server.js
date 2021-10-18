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
            message: 'How would you like to update your Employees?',
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
        switch(answer.option){
            case "View All Employees?":
                viewAllEmployees();
                break;
            case "Add New Employee":
                addNewEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
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

const viewAllEmployees = () =>{
    //See if you can alter the table column from name to department
    db.query(`SELECT employee.id,
                     employee.first_name AS FirstName,
                     employee.last_name AS LastName,
                     roles.title AS Title,
                     roles.salary AS Salary,
                     department.name AS Department, 
                     CONCAT(manager.first_name, ' ' , manager.last_name) AS Manager
              FROM employee 
              LEFT JOIN roles ON employee.role_id = roles.id 
              LEFT JOIN department ON department.id = roles.department_id 
              LEFT JOIN employee manager ON employee.manager_id = manager.id;
    `, (err,res) => {
        if(err){
            console.error(err);
        }
        else{
            console.log(`
-------------------------------------------------------------------------------
                            EMPLOYEE DATABASE
-------------------------------------------------------------------------------`);
            console.table(res);
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
            type: 'list',
            message: "Who is their manager?",
            name: 'manager',
            choices: chooseEmployee()
        }
    ])
    .then ((answer) => {
        let roleID = roleList.indexOf(answer.role) + 1;
        let managerID = employeeList.indexOf(answer.manager) + 1;
        console.log("MAnagerID: " + managerID);
        if(answer.manager === 'This Employee is a Manager'){
            managerID = null;
        }
        db.query(`
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            Values (?, ?, ?, ?)`, [answer.firstName, answer.lastName, roleID, managerID], 
            function(err) {
                if (err){
                    console.error(err);
                }
                else{
                    console.log(`
------------------------------------------------------------------
            ${answer.firstName} ${answer.lastName} Is Now In The Employee Database!
------------------------------------------------------------------`);
                    initializeQuestions();
            } 
        });
    });
}

let roleList = [];
const chooseRole = () => {
    roleList = [];
    db.query("SELECT title FROM roles", (err, roles) => {
        if(err){
            console.error(err);
        }
        else{
            for(i = 0; i < roles.length; i++){
                roleList.push(roles[i].title);
            }
        }
    });
    return roleList;
}

const chooseEmployee = () => {
    employeeList = [];
    db.query("SELECT * FROM employee", (err, name) => {
        if(err){
            console.error(err);
        }
        else{
            for(i = 0; i < name.length; i++){
                employeeList.push(`${name[i].first_name} ${name[i].last_name}`);
            }
            employeeList.push('This Employee is a Manager');
        }
    });
    return employeeList;
}

const updateEmployeeRole = () => {
    console.log(`
---------------------------------------------------------------------
                UPDATING EMPLOYEE ROLE
---------------------------------------------------------------------`);
    inquirer.prompt([
        {
            type: 'list',
            message: "What is the Employee ID Number You Want To Update?",
            name: 'ID',
            choices: [1,2,3]
        },
        {
            type: 'input',
            message: "What is the Employee's First Name?",
            name: 'firstName'
        },
        {
            type: 'input',
            message: "What is the Employee's Last Name?",
            name: 'lastName'
        },        {
            type: 'list',
            message: "What is the Employee's new Role?",
            name: 'role',
            choices: chooseRole()
        },
        {
            type: 'list',
            message: "Who is the Employee's manager?",
            name: 'manager',
            choices: chooseEmployee()
        },
    ])
    .then((answer) => {
        console.log(employeeList);
        let roleID = roleList.indexOf(answer.role) + 1;
        let managerID = employeeList.indexOf(answer.manager) + 1;
        console.log("managerID: " + managerID);
        console.log("answer: " + answer.manager);
        db.query(`
            UPDATE employee
             SET first_name = "${answer.firstName}",
                 last_name = "${answer.lastName}",
                 role_id = "${roleID}",
                 manager_id = "${managerID}"
            WHERE id = "${answer.ID}"`); 
            
        console.log(`
-------------------------------------------------------------------------------
            ${answer.firstName} ${answer.lastName} Is Now Updated In The Employee Database!
-------------------------------------------------------------------------------`);
        initializeQuestions();
    })
}








initializeQuestions();