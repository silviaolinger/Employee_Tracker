//const {start} = require("repl");

const inquirer = require ("inquirer");
const mysql = require ("mysql");
const cTable = require("console.table");

// connecting the database 
const connection = mysql.createConnection({
    host: "localhost",
    port:3306,

//username and password
    user:"root",
    password:"root",
    database:"employee_db"

});

//connect the mySql server and database
connection.connect(function(err){
 if (err) throw err;
 console.log("Sql connected");
 start();
});

function start(){

    inquirer
    .prompt ([
        {
            type: "list",
            name:"start",
            message:"What Would like to do in the tables?",
            choices:["View", "Update", "Add", "Exit"]

    }
]).then (function(res){
    switch(res.start){
        case "View":
            view();
            break;
        case "Add":
            add();
            break;
        case "Update":
            updateEmployee();
            break;
        case "Exit":
            console.log("All done");
            break;
        default:
            console.log("default");


    }
});

}
  function view(){
    inquirer
    .prompt ([
        {
            type: "list",
            name: "view",
            message: "What Would like to see",
            choices:["All Employees", "By department", "By role"]
        }

    ]).then(function(res){
            switch (res.view){
                case "All Employees":
                    viewAllEmployees();
                    break;
                case "By department":
                    viewByDepartment();
                    break;
                case "By role":
                    viewByRole();
                    break;
                default:
                    console.log("default")
            }
    });
  }

  function viewAllEmployees(){
    connection.query
    ("SELECT e.id as ID, e.first_name AS FIRST, e.last_name AS LAST, e.role1_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department from employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role1 r ON  e.role1_id = r.title LEFT JOIN department d ON r. department_id = d.id", function (err, results){
        if (err) throw err;
        console.table(results);
        start();

    });
  }
   function viewByDepartment(){
    connection.query ("SELECT * FROM  department", function(err, results){
        if (err) throw err;
        inquirer
        .prompt([
            {
                name:"choice",
                type:"rawlist",
                choices: function(){
                    var choiceArr= [];
                    for (i=0; i< results.length; i++){
                        choiceArr.push(results[i].name);

                    }
                    return choiceArr;

                },
                message:"Select Department"
            

        }
        ]).then(function (answer){
            connection.query(
                "Select e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role1_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role1 r ON e.role1_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE d.name=?",[answer.choice], function (err, results){
                    if (err) throw err;
                    console.table(results)
                    start();

                }
            )
        });
    
    });
   }

   function viewByRole(){
    connection.query ("SELECT title FROM  role1", function(err, results){
        if (err) throw err;
        inquirer
        .prompt([
            {
                name:"choice",
                type:"rawlist",

                choices: function(){
                    var choiceArr=[];
                    for (i=0; i< results.length; i++){
                        choiceArr.push(results[i].title);

                    }
                    return choiceArr;

                },
                message:"Select Role"
            

        }
        ]).then(function (answer){
            console.log(answer.choice);
            connection.query(
                "Select e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role1_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role1 r ON e.role1_id = r.title LEFT JOIN department d ON r.department_id= d.id WHERE e.role1_id=?" ,
                [answer.choice], function (err,results){
                    if (err) throw err;
                    console.table(results)
                    start();

                }
            )
        });
    
    });

   }
   function add(){
    inquirer 
    .prompt([
        {
            type:"list",
            name:"add",
            message:"What Would like to add?",
            choices:["Department", "Employee Role", "Employee"]


    }

    ]).then(function(res){
    switch (res.add){
        case "Department":
            addDepartment();
            break;
        case "Employee Role":
            addEmployeeRole();
            break;
        case "Employee":
            addEmployee();
        default:
            console.log("default");

    }
})
   }

   function addDepartment (){
    inquirer
    .prompt ([
        {
            name:"department",
            type:"input",
            message:"Please enter department name"

        }
    ]).then (function(answer){
         connection.query(
            "INSERT INTO department VALUES (DEFAULT, ?)",
            [answer.department],
            function (err){
                if (err) throw err;
                console.log ("departments updated with " + answer.department);
                start();

                }
         )
            })
    }

    function addEmployeeRole(){
        inquirer
        .prompt ([
            { 
                name:"role1",
                type:"input",
                message:"Please enter new role title:"


            },
            {
                name:"salary",
                type:"input",
                message:"Please enter salary:",
                validate: function (value){
                    if(isNaN(value)=== false){
                        return true;

                    }
                    return false;

                }
            },
            {
                name: "department_id",
                type: "number",
                message:"Please enter deparment id:",
                validate: function (value){
                    if(isNaN(value)=== false){
                        return true;

                    }
                    return false;

                }
            }
        ]).then (function (answer){
            connection.query(
                "INSERT INTO role1 SET ?",
                {
                    title: answer.role1,
                    salary: answer.salary,
                    department_id: answer.department_id
                },
                function (err){
                    if (err) throw err;
                    console.log("Employee role updated with " + answer.role1);
                    start();
                }
            )
        })
    }

    function addEmployee(){
            connection.query (
                "SELECT * FROM role1", function (err, results){
                    if (err) throw err;
                    inquirer
                    .prompt ([
                        {
                            name:"firstName",
                            type:"input",
                            message:"Please enter first name:"

                        },
                        {
                            name:"lastName",
                            type:"input",
                            message: "Enter employee last name:"
                        },
                        {
                            name:"role1",
                            type:"rawlist",
                            choices: function (){
                                var choiceArr = [];
                                for (i=0; i< results.length; i++){
                                    choiceArr.push(results[i].title)
                                }
                                return choiceArr;
                            },
                                message: "Select title: "
                        

                            },
                            {
                                name:"manager",
                                type:"number",
                                validate: function (value){
                                    if (isNaN (value)=== false){
                                        return true;
                                    }
                                    return false;
                                },
                                message: "Enter manager ID",
                                default: "1"
                        }
                    ]).then (function (answer){
                        connection.query(
                            "INSERT INTO employee SET ?" ,
                            {
                                first_name: answer.firstName,
                                last_name: answer.lastName,
                                role1_id: answer.role1,
                                manager_id: answer.manager
                            }
                            )
                            console.log("Employee Added Sucessfully");
                            
                            start();
                        }

                    )
                }
                )
    }

   function updateEmployee(){
    connection.query("SELECT * FROM employee",
        function (err, results){
            if (err) throw err;
            inquirer
            .prompt([
                {
                    name:"choice",
                    type:"rawlist",
                    choices: function (){
                        let choiceArr =[];
                        for(i=0; i< results.length; i++)
                        {
                            choiceArr.push(results[i].last_name);

                        }
                        return choiceArr;

                    },
                    message:"Select employee to update"
                }
            ]).then (function(answer){
                const saveName= answer.choice;
                connection.query("SELECT * FROM employee",
                function (err,results){
                    if (err) throw err;
                    inquirer
                    .prompt ([
                        {
                            name: "role",
                            type:"rawlist",
                            choices: function(){
                            var choiceArr = [];
                            for (i=0; i< results.length; i++){
                                choiceArr.push(results[i].role1_id)
                            }
                            return choiceArr;
                            },
                            message: "Select title"
                        },
                        {
                            name:"manager",
                            type:"number",
                            validate: function (value){
                                if(isNaN(value) === false){
                                    return true;

                                }
                                return false;

                            },
                            message: "Please enter new manager ID",
                            default: "1"   
                        }
                    ]).then (function (answer){
                        console.log(answer);
                        console.log(saveName);
                        connection.query("UPDATE employee SET ? WHERE last_name = ?",
                        [
                            {
                                role1_id: answer.role,
                                manager_id: answer.manager

                            }, saveName

                        ],
                        ),
                        console.log ("Employee update");
                        start();
                    });
                })
            

            })
        })
   }