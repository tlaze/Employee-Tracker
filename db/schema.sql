-- Creates employees_db after deleting any copies of the database
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

-- Selects employees_db
USE employees_db;

-- Creates department Table with values of id and name
CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

-- Creates roles Table with values id, title, salary, and department_id
CREATE TABLE roles (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)-- Links roles and department Tables: roles.department_id and department.id
    ON DELETE SET NULL
);

-- Creates employee Table with values id, first_name, last_name, role_id, and manager_id
CREATE TABLE employee (
    id INT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)-- Links employee and roles table: employee.role_id and roles.id
    ON DELETE SET NULL
);



