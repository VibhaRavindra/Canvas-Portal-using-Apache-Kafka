
var {CourseModel, UserModel} = require('../MongoDbConnection');
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
    console.log("submit answers: " + msg)
    CourseModel.findOne({"quizzes._id":msg.quizid}, {"quizzes.$":1}, (err, findCourse)=>{
            if(err || findCourse == null) {
                callback(null, {success:false})
            } else {
                let quiz_name = findCourse.quizzes[0].name
                let total_points = findCourse.quizzes[0].total_points
                let courseid = findCourse._id
                let score = 0
                findCourse.quizzes[0].questions.forEach(question => {
                    if(question.correct_option === msg.answers[question._id])
                        score += question.points
                });
                UserModel.findOne({_id:msg.userid},{quiz_answers:1}, (err, findUser)=>{
                    if(err || findUser == null){
                        console.log("errr or null")
                        console.log(err)
                        callback(null, {success:false})
                    } else {
                        let found = false;
                        if(findUser.quiz_answers != null) {
                            findUser.quiz_answers.forEach((answer)=>{
                                if(answer.quiz_id == msg.quizid)
                                    found = true;
                            })
                        }
                        if(found){
                            UserModel.findOneAndUpdate({_id:msg.userid, "quiz_answers.quiz_id":msg.quizid},{"$set":{"quiz_answers.$.score":score}}, (err, result)=>{
                                if(err){
                                    console.log(err)
                                    callback(null, {success:false})
                                } else {
                                    callback(null, {success:true, score:score})
                                }
                            })
                        } else {
                            if(findUser.quiz_answers == null) {
                                findUser.quiz_answers = []
                            }
                            findUser.quiz_answers.push({
                                quiz_id: msg.quizid,
                                quiz_name: quiz_name,
                                total_points: total_points,
                                course_id: courseid,
                                score: score
                            })
                            findUser.save((err, result)=>{
                                if(err){
                                    console.log(err)
                                    callback(null, {success:false})
                                } else {
                                    callback(null, {success:true, score:score})
                                }
                            })
                        }
                    }
                })
                // UserModel.findOne({_id:msg.userid, "quiz_answers.quiz_id":msg.quizid}, {"quiz_answers.$":1}, (err, findUser)=>{
                //     if(err) {
                //         callback(null, {success:false})
                //     }else if(findUser == null) {
                //         UserModel.findOne({_id:msg.userid}, {"quiz_answers.$":1}, (err, findNewUser)=>{
                //             if(err) {
                //                 callback(null, {success:false})
                //             }
                //             console.log("findNewUser " + findNewUser)
                //             if(findNewUser.quiz_answers == null)
                //                 findNewUser.quiz_answers = []
                //             findNewUser.quiz_answers.push({
                //                 quiz_id: quizid,
                //                 quiz_name: quiz_name,
                //                 total_points: total_points,
                //                 course_id: courseid,
                //                 score: score
                //             })
                //             findNewUser.save((err, result)=>{
                //                 if(err) {
                //                     callback(null, {success:false})
                //                 } else {
                //                     callback(null, {success:true})
                //                 }
                //             })
                //         })
                //     } else {
                //         // found previous answer for this quiz, now update it
                //         findUser.quiz_answers[0].score = score;
                //         findUser.save((err, result)=>{
                //             if(err) {
                //                 callback(null, {success:false})
                //             } else {
                //                 callback(null, {success:true})
                //             }
                //         })
                //     }
                // })
            }
    })
    // const query = "SELECT question_id, correct_answer, points from quiz_question where quiz_id=?"
    // mysqlconnection.query(query,[msg.quizid],(err, rowsOfTable)=>{
    //     if(err) {
    //         console.log(err)
    //         callback(null, {success:false})
    //     }else{
    //     let score = 0
    //     let answerJson = {}
    //     for(i=0;i<rowsOfTable.length;i++) {
    //         const given_ans = req.body[rowsOfTable[i].question_id]
    //         if(given_ans === rowsOfTable[i].correct_answer) {
    //             score += rowsOfTable[i].points
    //         }
    //         answerJson[rowsOfTable[i].question_id] = given_ans
    //     }
    //     mysqlconnection.query("INSERT into quiz_answers VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE answers=?, score=?",[msg.quizid, msg.userid, JSON.stringify(answerJson), score,JSON.stringify(answerJson), score],(err, response)=>{
    //         if(err) {
    //             console.log(err)
    //             callback(null, {success:false})
    //         }else {
    //             callback(null, {success:false, score:score})
    //         }
    //     })
    //     }
    // })
};

exports.handle_request = handle_request;


