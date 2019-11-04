var {CourseModel} = require('../MongoDbConnection');
// const mysql = require('mysql');

// var mysqlconnection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "rootPassword",
//     database: "Canvas"
// });
  
// mysqlconnection.connect(err => {
//     if (err) 
//     throw err;
// })

function handle_request(msg, callback){
    CourseModel.findOne({_id:msg.courseid}, {quizzes:1}, (err, findCourse)=>{
        if(err || findCourse == null) {
            callback(null, {quizzes:[]})
        } else {
            let quizArray = [];
            findCourse.quizzes.forEach(quiz => {
                quizArray.push({
                    quiz_name:quiz.name,
                    quiz_id:quiz._id,
                    instructions:quiz.instructions,
                    num_questions:quiz.num_questions,
                    total_points:quiz.total_points
                })  
            });
            callback(null, {quizzes:quizArray});
        }
    })
    // const query = "SELECT * from quiz where course_id=?"
    // mysqlconnection.query(query,[msg.courseid], (err, rowsOfTable)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {quizzes:[]})
    //     } else {
    //         let quizArray = [];
    //         for (i=0;i<rowsOfTable.length;i++){
    //             quizArray.push(
    //                 {
    //                     quiz_name:rowsOfTable[i].quiz_name,
    //                     quiz_id:rowsOfTable[i].quiz_id,
    //                     instructions:rowsOfTable[i].instructions,
    //                     num_questions:rowsOfTable[i].num_questions,
    //                     total_points:rowsOfTable[i].total_points
    //                 }
    //             )
    //         }
    //         callback(null, {quizzes:quizArray})
    //     }
    // })
};

exports.handle_request = handle_request;


