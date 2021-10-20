//Declares dependencies
const mysql = require('mysql2');
const inquirer = require("inquirer");
require('console.table');

//Creates connection with mysql
const db = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: 'root1234',
        database: 'employees_db'
    },
    console.log("Connected to the employees_db database.")
);

//Starter function
const init = () => {
    console.log(`
    ------------------------------------------------------------------------------
                WELCOME! VIEW OR MAKE CHANGES TO THE EMPLOYEE DATABASE
    ------------------------------------------------------------------------------
    `);
    initializeQuestions();
}

//Prompts user how they would like to alter the database
const initializeQuestions = () =>{

    inquirer.prompt([
        {
            type: 'list',
            message: 'How would you like to update the Database?',
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
    //User's choice results in different outcome
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
                quit();
                break;                
        }
    });
}

//Displays every Department in the department Table
const viewAllDepartments = () => {

    db.query(`SELECT id, department.name AS Name FROM department`, (err,dept) => {
        if(err){
            console.error(err);
        }
        else{
            console.log(`
            ------------------------------------------------------------------------------
                                Current Departments In The Database
            ------------------------------------------------------------------------------
            `);
            console.table(dept);
            initializeQuestions();
        }
    })
}

//Displays every Role in the roles Table
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
                                Current Roles In The Database
            ------------------------------------------------------------------------------
            `);
            console.table(role);
            initializeQuestions();
        }
    })
}


//Displays every Employee in the employee Table
const viewAllEmployees = () =>{
    db.query(`
    SELECT employee.id,
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
            ------------------------------------------------------------------------------
            `);
            console.table(res);
            initializeQuestions();
        }
    }
)};

//Allows user to enter a new department into the database
const addNewDepartment = () => {
    console.log(`
    ------------------------------------------------------------------------------
                        ADD New Department To The Database
    ------------------------------------------------------------------------------
    `);

    db.query(`SELECT * FROM department`, (err, dept) => {
        if(err){
            console.error(err);
        }
        else{
            console.table(dept);
            //Prompts user for new department name
            inquirer.prompt([
                {
                    type: 'input',
                    message: "Whats The Name Of The New Department?",
                    name: 'department',
                },
            ])
            .then((answer) => {
                //Makes a query to mysql to insert values into department Table
                db.query(
                `INSERT INTO department (name)VALUES (?)`, [answer.department]), (err) => {
                    if(err){
                        console.error(err);
                    }
                }
                console.log(`
                ------------------------------------------------------------------------------
                                ${answer.department} Added To Departments!
                ------------------------------------------------------------------------------
                `);
                initializeQuestions();          
            })                            
        }
    })
}

//Prompts the user to add a new Role to the roles Table
const addNewRole = () => {

    console.log(`
    ------------------------------------------------------------------------------
                        ADD New Role To The Database
    ------------------------------------------------------------------------------
    `);

    db.query(`SELECT * FROM department`, (err, dept) => {
        if(err){
            console.error(err);
        }
        else{
            const deptArray = dept.map(function(department) {
                return `${department.name}`;
            });

            //If the Roles's Department is not in the database yet, gives user ability to add it before continuing
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
                    //Prompts for new role's values
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
                        let deptID = deptArray.indexOf(answer.department) + 1;  //deptArray contains all the roles in role Table. deptId matches the index value to the id value
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
                                ------------------------------------------------------------------------------
                                `);
                                initializeQuestions();
                            } 
                        });
                    })
                }
            })
        }
    })
}

//Prompts user to add a new employe to the employee Table
const addNewEmployee = () => {

    console.log(`
    ------------------------------------------------------------------------------
                        ADD New Employee To The Database
    ------------------------------------------------------------------------------
    `);

    db.query('SELECT * FROM employee', (err, name) => {
        if(err){
            console.error(err);
        }
        else{
            //Creates array of names in employee Table for choosing a manager name
            const employeeArray = name.map(function(emp) {
                return `${emp.first_name} ${emp.last_name}`;
            });
            //Adds choice for user to choose employee as a manager
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
                    choices: chooseRole()//returns all the roles in roles Table to choose from
                },
                {
                    type: 'list',
                    message: "Who is their manager?",
                    name: 'manager',
                    choices: employeeArray
                }
            ])
            .then ((answer) => {
                let roleID = roleList.indexOf(answer.role) + 1; //Gets id value for the new employee
                let managerID = employeeArray.indexOf(answer.manager) + 1;  //Gets the index value for chosen manager name
                
                //If user chooses the new employee to be a manager, managerID returns null
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
                            ------------------------------------------------------------------------------
                            `);
                            initializeQuestions();
                        } 
                });
            });
        }
    });
}

//Function used multiple times to display choices of roles available in roles Table
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

//Changes the data at the row of the chosen ID
//Known bug: If the selected Manager is located in the same employee ID number as their index value in managerArray
//the new employee's name will be displayed instead of the chosen manager. 
const updateEmployeeRole = () => {
    console.log(`
    ------------------------------------------------------------------------------
                                UPDATING EMPLOYEE's ROLE
    ------------------------------------------------------------------------------
    `);
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
            //Generates the ID's for prompting which row to change
            const idArray = res.map(function(i) {
                return `${i.id}`;
            })
            //Generates the manager choices for the updated employee
            const managerArray = res.map(function(manager) {
                return `${manager.first_name} ${manager.last_name}`;
            });
            //Gives option to have updated employee be a manager
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
                        ------------------------------------------------------------------------------`
                        );
                        console.table(res.employee);
                        initializeQuestions();
                    }
                });   
            }) 
        }
    });
}
//Stops the program
const quit = () => {
    console.log(`
    ---------------------------------------------
    Thank You For Using This Program. GoodBye!
    ---------------------------------------------
    `);
    process.exit();
}
//Starts the program
init();