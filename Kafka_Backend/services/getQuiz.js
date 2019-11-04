var {UserModel, CourseModel} = require('../MongoDbConnection');
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
    CourseModel.findOne({"quizzes._id":msg.quizid}, {"quizzes.$":1}, (err, findQuiz)=>{
        if(err || findQuiz == null) {
            callback(null, {quiz:{}})
        } else{
            callback(null, {
                quiz:{
                    quiz_name:findQuiz.quizzes[0].name,
                    instructions:findQuiz.quizzes[0].instructions,
                    total_points:findQuiz.quizzes[0].total_points,
                    num_questions:findQuiz.quizzes[0].num_questions
                }
            })
        }
    })
    // mysqlconnection.query('SELECT * FROM quiz where quiz_id=?',[msg.quizid],(err, rowsOfTable)=> {
    //     if(err || rowsOfTable.length!=1){
    //         console.log(err);
    //         callback(null, {quiz:null})
    //     }else {
    //         callback(null, {
    //             quiz:{
    //                 quiz_name:rowsOfTable[0].quiz_name,
    //                 instructions:rowsOfTable[0].instructions,
    //                 total_points:rowsOfTable[0].total_points,
    //                 num_questions:rowsOfTable[0].num_questions
    //             }
    //         })
    //     }
    // });
};

exports.handle_request = handle_request;


