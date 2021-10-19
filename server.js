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
              CONCAT(employees.first_name, ' ' , employees.last_name) AS Manager
              FROM employee 
              LEFT JOIN employee employees ON employee.manager_id = employees.id
              INNER JOIN roles ON employee.role_id = roles.id 
              INNER JOIN department ON roles.department_id = department.id
              ORDER BY employee.id;
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
        // console.log('--------');
        // console.table(name);
        // console.log('--------');
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
            message: "What is the ID Number You Want To Update?",
            name: 'ID',
            choices: [1,2,5]
        },
        {
            type: 'input',
            message: "What is the New Employee's First Name?",
            name: 'firstName'
        },
        {
            type: 'input',
            message: "What is the New Employee's Last Name?",
            name: 'lastName'
        },
        {
            type: 'list',
            message: "What is the Employee's New Role?",
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
        let roleID = roleList.indexOf(answer.role) + 1;
        let managerID = employeeList.indexOf(answer.manager)+1;
        console.log("ManagerID: " + managerID);
        console.log(employeeList);
        console.log(employeeList.indexOf(answer.manager));
        console.log(typeof managerID);

        // if(managerID === employeeList[0].id)

        if(answer.manager === 'This Employee is a Manager'){
            managerID = null;
        }
        // else if(`${answer.firstName} ${answer.lastName} === ${answer.manager}`){
        //     managerID = null;
        // }
        db.query(`
            UPDATE employee
            SET first_name = "${answer.firstName}",
                last_name = "${answer.lastName}",
                role_id = "${roleID}",
                manager_id = ${managerID}
            WHERE id = "${answer.ID}"`, (err,res) => {
                if(err){
                    console.error(err);
                }
                else{
                    console.log(`
            -------------------------------------------------------------------------------
                        ${answer.firstName} ${answer.lastName} Is Now Updated In The Employee Database!
            -------------------------------------------------------------------------------`);
                    initializeQuestions();

                }
            }); 
            
    })
}







initializeQuestions();