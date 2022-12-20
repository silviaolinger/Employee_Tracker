const { start } = require("repl");

const inquirer = requirer ("inquirer");
const mysql = requirer ("mysql");
const ctable = requirer ("console.table");

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
            update();
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
            type: list,
            name: view,
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
                default:
                    console.log("default")
            }
    });
  }

  function viewAllEmployees(){
    connection.query
    ("SELECT e.id as ID, e.first_name AS FIRST, e.last_name AS LAST, e.role1_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department from employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON  e.role_id = r.title LEFT JOIN department d ON r. departament_id = d.id", function (err, results){
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
                choices:function(){
                    let choiceArr=[];
                    for (i=0; i<results.legth; i++){
                        choiceArr.push(results[i].name);

                    }
                    return choiceArr;

                },
                message:"Select Department"
            

        }
        ]).then(function (answer){
            connection.query(
                "Select e.id AS ID, e.first_name AS First, e.last_name AS last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.departament_id= d.id WHERE d.name=?", 
                [answer.choice], function (err,results){
                    if (err) throw err;
                    console.log(results)
                    start();

                }
            )
        });
    
    });
   }
   function viewByRole(){
    connection.query ("SELECT title FROM  role", function(err, results){
        if (err) throw err;
        inquirer
        .prompt([
            {
                name:"choice",
                type:"rawlist",
                choices:function(){
                    let choiceArr=[];
                    for (i=0; i<results.legth; i++){
                        choiceArr.push(results[i].name);

                    }
                    return choiceArr;

                },
                message:"Select Role"
            

        }
        ]).then(function (answer){
            connection.query(
                "Select e.id AS ID, e.first_name AS First, e.last_name AS last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.departament_id= d.id WHERE e.role_id=?" ,
                [answer.choice], function (err,results){
                    if (err) throw err;
                    console.log(results)
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
                console.log ("Departaments updated with " + answer.department);
                start();

                }
         )
            })
    }

   