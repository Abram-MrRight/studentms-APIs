const db = require("../models");
const Student = db.students;
const StudentFinance = db.studentfinances;
const StudentPayment = db.studentpayments;
const { Sequelize } = db;
const StudentMessage =db.studentmessages

exports.GetAllStudents = (req, res) => {
    Student.findAll({
        include: [StudentFinance]
    })
        .then(
            data => {
                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Students successfully retrieved",
                    number_of_students: data.length,
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while retrieving Students"
            });
        }
        );
} 

// Update
// using get and post
exports.UpdateStudent = (req, res) => {
    
    console.log("METHOD");
    console.log(req.method);

     if(req.method == "PUT"){

        // const student_id = req.body.t_id;
        // const student_id = req.params.id;
        // const student_id = req.query.t_id;
        const student_id = req.params.id;
        Student.update(req.body, {
            where: { student_id: student_id }
        }).then(
            data => {
                if(data == 1){
                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Updated",
                    });
                }else{
                    res.send({
                        status: "Error",
                        status_code: 100,
                        message: "Student Not Updated",
                    }); 
                }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While updating a student"
            });
        });

     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}

// Create
exports.CreateStudent = (req, res) => {
    
    console.log("METHOD");
    console.log(req.method);

     if(req.method == "POST"){

        if(!req.body.first_name){
            res.send({
                status: "Error",
                status_code: 10012,
                message: "Student First Name is required",
            }); 

            return;
        }

        if(!req.body.last_name){
            res.send({
                status: "Error",
                status_code: 10013,
                message: "Student Last Name is required",
            }); 

            return;
        }

        if(!req.body.school_fees_amount){
            res.send({
                status: "Error",
                status_code: 10013,
                message: "Student Fees Amount is required",
            }); 

            return;
        }

        // Add code which detects a wrong field entered

        const student_data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            class: req.body.class,
        }

        Student.create(student_data).then(
            async data => {
                // if(data == 1){
                    await StudentFinance.create({
                        student_id: data.student_id,
                        school_fees_amount: req.body.school_fees_amount
                    });

                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Added",
                        result: data
                    });
                // }else{
                //     res.send({
                //         status: "Error",
                //         status_code: 100,
                //         message: "Student Not Updated",
                //     }); 
                // }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While adding a student"
            });
        });

     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}

// Delete
exports.DeleteStudent = async (req, res) => {
    
    console.log("METHOD");
    console.log(req.method);

     if(req.method == "DELETE"){

        const student_id = req.params.id;
        const student_id_db = await Student.findByPk(student_id);

        if(student_id_db === null){

            res.send({
                status: "Error",
                status_code: 100,
                message: "Student ID passed Not in the Database",
            }); 

            return;
        }

        Student.destroy({
            where: { student_id: student_id }
        }).then(
            data => {
                if(data == 1){
                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Deleted",
                    });
                }else{
                    res.send({
                        status: "Error",
                        status_code: 100,
                        message: "Student Not Deleted",
                    }); 
                }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While updating a student"
            });
        });
    
    
     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}


// Search Student
exports.SearchStudent = async (req, res) => {
    const search_query = req.query.first_name;
    var condition = search_query ? { first_name: { [Operation.like] : `%${search_query}%` } } : null;

    Student.findAll({where: condition})
        .then(
            data => {
                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Students successfully retrieved",
                    number_of_students: data.length,
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while searching Students"
            });
        }
        );

}


// Get student finances
// Retrieve all Students from the db
exports.GetStudentFinances = (req, res) => {
    StudentFinance.findAll({
        // include: [{model: Student, attributes: []}]
        include: [Student],
        // attributes: [
        //     'finance_id',
        //     [db.Sequelize.fn('sum', db.Sequelize.col('school_fees_amount')), 'total_expected'],
        // ],
        // group
    }).then(
            async data => {

                const total_expected = await StudentFinance.findAll({
                    attributes: [
                        // function to calc the sum
                        [db.Sequelize.fn('sum', db.Sequelize.col('school_fees_amount')), 'total'],
                    ],
                    raw: true,
                });

                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Student Finances successfully retrieved",
                    number_of_students: data.length,
                    total_expected: total_expected[0]['total'],
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while retrieving Student Finances"
            });
        }
        );
}

// Make a payment
exports.MakePayment = async (req, res) => {
    
    console.log("METHOD");
    console.log(req.method);

     if(req.method == "POST"){

        const student_id_dbx = await Student.findByPk(req.body.student_id);
        if(student_id_dbx === null){

            res.send({
                status: "Error",
                status_code: 100,
                message: "Student ID passed Not in the Database",
            }); 

            return;
        }

        if(!req.body.amount_paid){
            res.send({
                status: "Error",
                status_code: 10013,
                message: "Amount Paid is required",
            }); 

            return;
        }

        // Add code which detects a wrong field entered

        const payment_data = {
            amount_paid: req.body.amount_paid,
            student_id: req.body.student_id,
        }

        StudentPayment.create(payment_data).then(
            async data => {
                // if(data == 1){
                    

                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Payment Added",
                        result: data
                    });
                // }else{
                //     res.send({
                //         status: "Error",
                //         status_code: 100,
                //         message: "Student Not Updated",
                //     }); 
                // }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While adding a student payment"
            });
        });

     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}

// Retrieve all Payments
exports.TotalPayments = (req, res) => {
    StudentPayment.findAll({
        // include: [{model: Student, attributes: []}]
        include: [Student],
        // attributes: [
        //     'finance_id',
        //     [db.Sequelize.fn('sum', db.Sequelize.col('school_fees_amount')), 'total_expected'],
        // ],
        // group
    }).then(
            async data => {

                const total_payments_received = await StudentPayment.findAll({
                    attributes: [
                        // function to calc the sum
                        [db.Sequelize.fn('sum', db.Sequelize.col('amount_paid')), 'total'],
                    ],
                    raw: true,
                });

                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Student Payments successfully retrieved",
                    number_of_students: data.length,
                    total_payments_received: total_payments_received[0]['total'],
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while retrieving Student Finances"
            });
        }
        );
}
 


//.......Assignment...........
// get student balance
exports.FeesBalance = async (req, res) => {
    console.log("METHOD:", req.method);

    if (req.method === "GET") {
        try {
            const data = await StudentFinance.findAll({
                attributes: [
                    'student_id',
                    'school_fees_amount',
                    [
                        Sequelize.literal('(SELECT COALESCE(SUM(amount_paid), 0) FROM studentpayments WHERE finance_id = studentfinance.finance_id)'),
                        'total_paid'
                    ],
                    [
                        Sequelize.literal('school_fees_amount - COALESCE((SELECT SUM(amount_paid) FROM studentpayments WHERE finance_id = studentfinance.finance_id), 0)'),
                        'balance'
                    ]
                ],
                include: [
                    {
                        model: Student,
                        attributes: [],
                    },
                ],
                raw: true,
            });

            res.status(200).json({
                status: "Success",
                status_code: 100,
                message: "Student Balance",
                result: data
            });
        } catch (err) {
            console.error("Error fetching student balances:", err.message);
            res.status(500).json({
                status: "Error",
                status_code: 101,
                message: err.message || "Error occurred while fetching student balances"
            });
        }
    } else {
        res.status(405).json({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });
    }
};

//my message APIs
//messages
//create message
exports.CreateMessage = async (req, res) => {
    console.log("METHOD");
    console.log(req.method);
    if(req.method == "POST"){
      const student_id_dbx = await Student.findByPk(req.body.student_id);
      if(student_id_dbx === null){
        res.send({
          status: "Error",
          status_code: 100,
          message: "Student ID passed Not in the Database",
        });
        return;
      }
      if(!req.body.message){
        res.send({
          status: "Error",
          status_code: 10014,
          message: "Message is required",
        });
        return;
      }
      const message_data = {
        student_id: req.body.student_id,
        message: req.body.message,
        sender: req.body.sender,
        receiver: req.body.receiver,
      }
      StudentMessage.create(message_data).then(async data => {
        res.send({
          status: "Success",
          status_code: 100,
          message: "Message Added",
          result: data
        });
      }).catch(err => {
        res.status(500).send({
          status: "Error",
          status_code: 101,
          message: err.message || "Error Occurred While adding a message"
        });
      });
    }else{
      res.status(500).send({
        status: "Error",
        status_code: 1011,
        message: "METHOD NOT ALLOWED"
      });
    }
  }
    
//search for messages
exports.GetMessages = async (req, res) => {
    try {
        const { studentId } = req.query;

        let queryOptions = {
            include: [{
                model: Student,
                required: true
            }]
        };

        if (studentId) {
            queryOptions.where = { student_id: studentId };
        }

        const messages = await StudentMessage.findAll(queryOptions);

        res.send({
            status: "Success",
            status_code: 100,
            message: "Messages Retrieved",
            result: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send({
            status: "Error",
            status_code: 500,
            message: "An error occurred while retrieving messages.",
            error: error.message
        });
    }
};

//delete message
exports.DeleteMessage = async (req, res) => {
    const message_id = req.body.message_id;
    const message = await StudentMessage.findByPk(message_id);
    if(!message){
      res.send({
        status: "Error",
        status_code: 10015,
        message: "Message Not Found",
      });
      return;
    }
    message.destroy().then(async data => {
      res.send({
        status: "Success",
        status_code: 100,
        message: "Message Deleted",
        result: data
      });
    }).catch(err => {
      res.status(500).send({
        status: "Error",
        status_code: 101,
        message: err.message || "Error Occurred While deleting a message"
      });
    });
  }