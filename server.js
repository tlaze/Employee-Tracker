const mysql = require('mysql2');
const inquirer = require("inquirer");
require('console.table');

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
                "View All Departments",
                "View All Roles",
                "View All Employees?",
                "Add New Department",
                "Add New Role",
                "Add New Employee",
                "Update Employee Role",
                "Quit",
            ]
        }
    ])
    .then ((answer) => {
        switch(answer.option){
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees?":
                viewAllEmployees();
                break;
            case "Add New Department":
                addNewDepartment();
                break;
            case "Add New Role":
                addNewRole();
                break;    
            case "Add New Employee":
                addNewEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;    
            case "Quit":
                testPrompts("Quit to test");
                break;                
        }
    });
}


const viewAllDepartments = () => {

    db.query(`SELECT id, department.name AS Name FROM department`, (err,dept) => {
        if(err){
            console.error(err);
        }
        else{
            console.log(`
------------------------------------------------------------------------------
    Current Departments In The Database
------------------------------------------------------------------------------`);
            console.table(dept);
            initializeQuestions();
        }
    })
}


const viewAllRoles = () => {
    db.query(`SELECT roles.id,
                     roles.title AS Title,
                     roles.department_id AS Department,
                     roles.salary As Salary,
                     department.name AS Department
                     FROM roles
                     LEFT JOIN department ON roles.department_id = department.id;
                     `, (err,role) => {
        if(err){
            console.error(err);
        }
        else{
            console.log(`
------------------------------------------------------------------------------
    Current Positions In The Database
------------------------------------------------------------------------------`);
            console.table(role);
            initializeQuestions();
        }
    })
}



const viewAllEmployees = () =>{
    //See if you can alter the table column from name to department
    db.query(`SELECT employee.id,
                     employee.first_name AS FirstName,
                     employee.last_name AS LastName,
                     roles.title AS Title,
                     department.name AS Department, 
                     roles.salary AS Salary,
              CONCAT(manager.first_name, ' ' , manager.last_name) AS Manager
              FROM employee
              LEFT JOIN roles ON employee.role_id = roles.id 
              LEFT JOIN department ON roles.department_id = department.id
              LEFT JOIN employee manager ON manager.id = employee.manager_id
              ORDER BY employee.id;
    `,(err,res) => {
        if(err){
            console.error(err);
        }
        else{
            console.log(`
------------------------------------------------------------------------------
                            EMPLOYEE DATABASE
------------------------------------------------------------------------------`);
            console.table(res);
            initializeQuestions();
        }
    }
)};


const addNewDepartment = () => {
    db.query(`SELECT * FROM department`, (err, dept) => {
        if(err){
            console.error(err);
        }
        else{

            console.table(dept);
            inquirer.prompt([
                {
                    type: 'input',
                    message: "Whats The Name Of The New Department?",
                    name: 'department',
                },
            ])
            .then((answer) => {
                db.query(`  INSERT INTO department (name)
                            VALUES (?)`, [answer.department]), (err) =>{
                                if(err){
                                    console.error(err);
                                }
                            }
                            console.log(`
------------------------------------------------------------------------------
    ${answer.department} Added To Departments!
------------------------------------------------------------------------------`);
                initializeQuestions();          
            })                            
        }
    })
}

const addNewRole = () => {

    db.query(`SELECT * FROM department`, (err, dept) => {
        if(err){
            console.error(err);
        }
        else{
            const deptArray = dept.map(function(department) {
                return `${department.name}`;
            });

            inquirer.prompt([
                {
                    type: 'confirm',
                    message: "Is this Role's Department in the database yet?",
                    name: 'confirm'
                },
            ])
            .then((response) => {
                if(response.confirm === false){
                    addNewDepartment();
                }
                else{

                    inquirer.prompt([
                        {
                            type: 'input',
                            message: "What is the name of Role you would like to add?",
                            name: 'newRole'
                        },
                        {
                            type: 'input',
                            message: "What is the Salary of this Position?",
                            name: 'salary'
                        },
                        {
                            type: 'list',
                            message: "What Department is this Role in?",
                            name: 'department',
                            choices: deptArray
                        },
                    ])
                    .then((answer) => {
                        console.log(answer);
        
                        let deptID = deptArray.indexOf(answer.department) + 1;
                        console.log(deptID);
                        db.query(`
                        INSERT INTO roles (title, salary, department_id)
                        Values (?, ?, ?)`, [answer.newRole, answer.salary, deptID], 
                        function(err) {
                            if (err){
                                console.error(err);
                            }
                            else{
                                console.log(`
        ------------------------------------------------------------------------------
                        ${answer.newRole} Is Now A Role In The Database!
        ------------------------------------------------------------------------------`);
                            initializeQuestions();
                        } 
                    });
                    })
                }
            })

        }
    })
}


const addNewEmployee = () => {

    db.query('SELECT * FROM employee', (err, name) => {
        if(err){
            console.error(err);
        }
        else{
            const employeeArray = name.map(function(emp) {
                return `${emp.first_name} ${emp.last_name}`;
            });
            employeeArray.push('This Employee is a Manager');

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
                    choices: employeeArray
                }
            ])
            .then ((answer) => {
                let roleID = roleList.indexOf(answer.role) + 1;
                let managerID = employeeArray.indexOf(answer.manager) + 1;
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
------------------------------------------------------------------------------
                    ${answer.firstName} ${answer.lastName} Is Now In The Employee Database!
------------------------------------------------------------------------------`);
                        initializeQuestions();
                    } 
                });
            });

        }
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


const updateEmployeeRole = () => {
    console.log(`
------------------------------------------------------------------------------
    UPDATING EMPLOYEE ROLE
------------------------------------------------------------------------------`);
    db.query(`  SELECT employee.id, employee.first_name AS FirstName, employee.last_name AS LastName FROM employee ORDER BY employee.id;`,(err,res) => {
        if(err){
            console.error(err);
        }
        else{
            console.table(res);
        }
    });

    db.query('SELECT * FROM employee', (err, res) => {
        if(err){
            console.error(err);
        }
        else{

            const idArray = res.map(function(i) {
                return `${i.id}`;
            })

            const managerArray = res.map(function(manager) {
                return `${manager.first_name} ${manager.last_name}`;
            });

            managerArray.push('This Employee is a Manager');

            inquirer.prompt([
                {
                    type: 'list',
                    message: "What is the ID Number You Want To Update?",
                    name: 'ID',
                    choices: idArray
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
                    choices: managerArray
                },
            ])
            .then((answer) => {
        
                let roleID = roleList.indexOf(answer.role) + 1;
                let managerID = managerArray.indexOf(answer.manager) + 1;

                if(answer.manager === 'This Employee is a Manager'){
                    managerID = null;
                }

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
------------------------------------------------------------------------------
        ${answer.firstName} ${answer.lastName} Is Now Updated In The Employee Database!
------------------------------------------------------------------------------`);
                        console.table(res.employee);
                        initializeQuestions();
                    }
                });   
            }) 
        }
    });
}








initializeQuestions();