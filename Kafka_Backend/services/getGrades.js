var {UserModel} = require('../MongoDbConnection');

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
    UserModel.findOne({_id:msg.userid, "assignment_submissions.course_id":msg.courseid}, {assignment_submissions:1}, (err, findAssign)=>{
        if(err) {
            console.log("getgrrades err 1" + err)
            callback(null, {grades:[], maxTotal:0, totalScore:0})
        }
        let maxTotal=0
        let totalScore=0
        let gradeArray = []
        if(findAssign != null) {
            findAssign.assignment_submissions.forEach(submission => {
                let score = "NA"
                if(submission.course_id == msg.courseid){
                    if(submission.latest_submission.isgraded == true) {
                        score = submission.latest_submission.grade
                        totalScore += score
                        maxTotal += submission.total_points
                    }
                    gradeArray.push({
                        name:submission.assignment_title,
                        id:submission.assignment_id,
                        score:score,
                        outof:submission.total_points,
                        type:"Assignment"
                    })
                }
            });
        }
        UserModel.findOne({_id:msg.userid, "quiz_answers.course_id":msg.courseid}, {quiz_answers:1}, (err, findQuizzes)=>{
            if(!err && findQuizzes!= null) {
                findQuizzes.quiz_answers.forEach(quiz=>{
                    if(quiz.course_id == msg.courseid) {
                        let score = quiz.score
                        totalScore += score
                        maxTotal += quiz.total_points
                        gradeArray.push({
                            name:quiz.quiz_name,
                            id:quiz.quiz_id,
                            score:score,
                            outof:quiz.total_points,
                            type:"Quiz"
                        })
                    }
                })
            }
            callback(null, {
                grades:gradeArray,
                maxTotal:maxTotal,
                totalScore:totalScore
            })
        });
    })
    // const query = "SELECT A.title as name, A.assignment_id as id, S.grade as score, S.isgraded as graded, A.points as outof, 'Assignment' as type FROM assignment A, assignment_submission S, (SELECT MAX(submission_id) as msid from assignment_submission WHERE student_id=? group by assignment_id) as MAS WHERE A.assignment_id=S.assignment_id AND S.submission_id=MAS.msid AND A.course_id=? UNION SELECT quiz_name as name, Q.quiz_id as id, score as score, 1 as graded, total_points as outof, 'Quiz' as type FROM quiz Q, quiz_answers QA WHERE Q.course_id=? AND QA.student_id=? AND Q.quiz_id=QA.quiz_id;"
    // const params = [msg.userid, msg.courseid, msg.courseid, msg.userid]
    // mysqlconnection.query(query, params, (err, rowsOfTable)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {
    //             grades:[],
    //             maxTotal:0,
    //             totalScore:0
    //         })
    //     } else {
    //         let maxTotal=0
    //         let totalScore=0
    //         let gradeArray = [];
    //         for (i=0;i<rowsOfTable.length;i++){
    //             let score = "NA"
    //             if(rowsOfTable[i].graded == 1) {
    //                 score = rowsOfTable[i].score
    //                 totalScore += score
    //                 maxTotal += rowsOfTable[i].outof
    //             }
    //             gradeArray.push(
    //                 {
    //                     name:rowsOfTable[i].name,
    //                     id:rowsOfTable[i].id,
    //                     score:score,
    //                     outof:rowsOfTable[i].outof,
    //                     type:rowsOfTable[i].type
    //                 }
    //             )
    //         }
    //         callback(null, {
    //             grades:gradeArray,
    //             maxTotal:maxTotal,
    //             totalScore:totalScore
    //         })
    //     }
    // })
};

exports.handle_request = handle_request;


