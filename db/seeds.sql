INSERT INTO department (name)
VALUES  ('Sales'),
        ('HR'),
        ('Accounting');

INSERT INTO roles (title, salary, department_id)
VALUES  ('JR', 100000, 1),
        ('Senior', 200000, 2),
        ('Manager', 300000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Tom', 'Lazore', 5, 2),
        ('Tyler','M', 5, 3),
        ('Bob', 'K', 6, 3);