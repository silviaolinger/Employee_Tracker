DROP database if exists employee.db;
Create database employee_db;

use employee_db;

create table department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

create table role1 (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id)
);

create table employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role1_id VARCHAR(30),
    manager_id INT,
    PRIMARY KEY (id)
);

INSERT INTO department (name)
values ("HR"), ("Tech"), ("Admin"), ("Management");

INSERT INTO role1 (title, salary, department_id)
values ("Director" , 100000, 1), ("Manager", 7500, 2), ("Web Dev", 8000, 3);

INSERT INTO employee (first_name, last_name, role1_id, manager_id)
values ("Rob", "Swanson", "Director", null), ("Jose","Alvares", "Manager", 1);
