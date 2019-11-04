var {UserModel,CourseModel} = require('../MongoDbConnection');
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
    CourseModel.findOne({"quizzes._id":msg.quizid},{"quizzes.$":1},(err, findCourse)=>{
        if(err || findCourse == null) {
            callback(null, {questions:[]});
        }
        UserModel.findOne({_id:msg.userid, "enrollment.course_id":findCourse._id, "enrollment.status":"ENROLL"}, {_id:1}, (err, findUser) => {
            if(err || findUser == null) {
                callback(null, {questions:[]});
            } else {
                let questionArray = []
                findCourse.quizzes[0].questions.forEach(question => {
                    let optionsArray = [question.correct_option, question.option2, question.option3, question.option4]
                    for(j=4; j>0;j--) {
                        const index = Math.floor(Math.random() * j);
                        const temp = optionsArray[j-1];
                        optionsArray[j-1] = optionsArray[index]
                        optionsArray[index]  =temp;
                    }
                    questionArray.push({
                        question_id:question._id,
                        question:question.question,
                        option1:optionsArray[0],
                        option2:optionsArray[1],
                        option3:optionsArray[2],
                        option4:optionsArray[3],
                        points:question.points
                    })
                });
                callback(null, {questions:questionArray})
            }
        })
    })
    // const query = "SELECT question_id, question, points, correct_answer, option2, option3, option4 FROM quiz_question QQ, quiz Q, enrollment E WHERE QQ.quiz_id=Q.quiz_id AND Q.course_id=E.course_id AND E.student_id=? AND E.status='ENROLL' AND QQ.quiz_id=?"
    // mysqlconnection.query(query,[msg.userid, msg.quizid],(err, rowsOfTable)=>{
    //     if(err)
    //     callback(null, {questions:[]});
    //     else {
    //         let questionArray = []
    //         for(i=0;i<rowsOfTable.length;i++){
    //             let optionsArray = [rowsOfTable[i].correct_answer,
    //             rowsOfTable[i].option2,rowsOfTable[i].option3,rowsOfTable[i].option4]
    //             for(j=4; j>0;j--) {
    //                 const index = Math.floor(Math.random() * j);
    //                 const temp = optionsArray[j-1];
    //                 optionsArray[j-1] = optionsArray[index]
    //                 optionsArray[index]  =temp;
    //             }
    //             questionArray.push(
    //                 {
    //                 question_id:rowsOfTable[i].question_id,
    //                 question:rowsOfTable[i].question,
    //                 option1:optionsArray[0],
    //                 option2:optionsArray[1],
    //                 option3:optionsArray[2],
    //                 option4:optionsArray[3],
    //                 points:rowsOfTable[i].points
    //                 }
    //             )
    //         } 
    //         callback(null, {questions:questionArray})
    //     }
    // })
};

exports.handle_request = handle_request;


