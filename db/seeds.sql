INSERT INTO department (name)
VALUES  ('Engineering'),    
        ('Finance'),        
        ('Legal'),          
        ('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES  ('Software Engineer', 100000, 1),
        ('Lead Engineer', 200000, 1),
        ('Accountant', 120000, 2),
        ('Account Manager', 150000, 2),
        ('Lawyer', 200000, 3),
        ('Legal Team Lead', 300000, 3),
        ('Sales Person', 100000, 4),
        ('Sales Lead', 150000, 4);




INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Codey', 'McMullen', 1, NULL),
        ('Ken','Leedy', 1, 1),
        ('Kevin', 'Malone', 2, NULL),
        ('Angela','Martin', 2, 2),
        ('Michael','Ross', 3, NULL),
        ('Harvey','Spector', 3, 3),
        ('Stanley','Hudson', 4, NULL),
        ('Jim','Halpert', 4, 4);   