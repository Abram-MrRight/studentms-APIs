module.exports = app => {
    // importing a student controller
    const student_controller = require("../controllers/student.controller");

    // import Router interface from express module
    var router = require("express").Router();

    // http://localhost:8080/api/studentms/getstudents
    // route to fetch all students
    router.get("/getstudents", student_controller.GetAllStudents);

    // route to update a specific Student
    router.all("/updatestudent/:id", student_controller.UpdateStudent);

    // route to update a specific Student
    router.all("/deletestudent/:id", student_controller.DeleteStudent);

    // route to update a specific Student
    router.all("/addstudent", student_controller.CreateStudent);

    // route to search a specific student by first name
    router.get("/findstudent", student_controller.SearchStudent);

    // route to get finances of all students
    router.get("/getstudentfinances", student_controller.GetStudentFinances);

    // http://localhost:8080/api/studentms/makepayment
    // route to make payment
    router.post("/makepayment", student_controller.MakePayment);

    // route to make payment
    router.get("/totalpayments", student_controller.TotalPayments);

     // http://localhost:8080/api/studentms/feesbalances
    // route to make payment
    router.get("/feesbalances", student_controller.FeesBalance);
    
     // route to make create message
     // http://localhost:8080/api/studentms/createMessage
    router.post("/createMessage", student_controller.CreateMessage);
     
     // http://localhost:8080/api/studentms/getMessage
     router.get("/getMessage", student_controller.GetMessages);

    // http://localhost:8080/api/studentms/deleteMessage
    router.post("/deleteMessage", student_controller.DeleteMessage);


    // define the base route
    app.use('/api/studentms', router);
}