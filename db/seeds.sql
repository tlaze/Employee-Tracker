-- Inserts values into department Table
INSERT INTO department (name)
VALUES  ('Engineering'),    
        ('Finance'),        
        ('Legal'),          
        ('Sales');

-- Inserts values into roles Table
INSERT INTO roles (title, salary, department_id)
VALUES  ('Software Engineer', 100000, 1),
        ('Lead Engineer', 200000, 1),
        ('Accountant', 120000, 2),
        ('Account Manager', 150000, 2),
        ('Lawyer', 200000, 3),
        ('Legal Team Lead', 300000, 3),
        ('Sales Person', 100000, 4),
        ('Sales Lead', 150000, 4);

-- Inserts values into employee Table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Mark', 'Zuckerberg', 1, 2),
        ('Steve','Jobs', 2, NULL),
        ('Kevin', 'Malone', 3, 4),
        ('Angela','Martin', 4, NULL),
        ('Michael','Ross', 5, 6),
        ('Harvey','Spector', 6, NULL),
        ('Stanley','Hudson', 7, 8),
        ('Jim','Halpert', 8, NULL);

-- Displays Tables in mysql
SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;  