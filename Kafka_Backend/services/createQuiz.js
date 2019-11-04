var {CourseModel} = require('../MongoDbConnection')
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

    var questionArray = []
    console.log(msg)
    msg.questions.forEach(question => {
        let local_points = 0
        if (question.points>0){
            local_points = question.points
        }
        questionArray.push({
            question: question.question,
            points: local_points,
            correct_option: question.correct_option,
            option2: question.option2,
            option3: question.option3,
            option4: question.option4
        })
    });
    const quiz = {
        name: msg.quiz_name,
        instructions: msg.quiz_inst,
        num_questions: msg.numQuestions,
        course_id: msg.courseid,
        total_points: msg.totalPoints,
        questions:questionArray
    }
    console.log(questionArray)
    console.log(quiz)
    CourseModel.findOne({_id:msg.courseid}, function(err, findCourse){
        if(err || findCourse == null) {
            callback(null, {success:false})
        } else {
            if(findCourse.quizzes == null) {
                findCourse.quizzes = []
            }
            findCourse.quizzes.push(quiz);
            findCourse.save(function(err, result){
                if(err)
                callback(null, {success:false})
                else
                callback(null, {success:true})
            })
        }
    })
    // const insertQuizQuery = "INSERT INTO quiz(quiz_name, instructions, course_id, num_questions, total_points) VALUES(?,?,?,?,?)"
    // const getQuizId = "SELECT LAST_INSERT_ID() as quiz_id"
    // const insertQuestions = "INSERT INTO quiz_question(quiz_id, question, points, correct_answer, option2, option3, option4) VALUES(?,?,?,?,?,?,?);"
    // mysqlconnection.query(insertQuizQuery,[msg.quiz_name, msg.quiz_inst, msg.courseid, msg.numQuestions, msg.totalPoints],(err, response)=>{
    //     if(err) {
    //         console.log(err);
    //         callback(null, {success:false})
    //     } else {
    //         mysqlconnection.query(getQuizId, (err, rowsOfTable)=>{
    //             if(err || rowsOfTable.length!=1) {
    //                 console.log(err);
    //                 console.log(rowsOfTable);
    //                 callback(null, {success:false})
    //             } else {
    //                 const quizid = rowsOfTable[0].quiz_id;
    //                 console.log("quizid "+ quizid)
    //                 for(i=0;i<msg.numQuestions;i++) {
    //                     let local_points = 0
    //                     if (msg.questions[i].points>0){
    //                         local_points = msg.questions[i].points
    //                     }
    //                     mysqlconnection.query(insertQuestions,[msg.quizid,msg.questions[i].question,local_points,msg.questions[i].correct_option,msg.questions[i].option2,msg.questions[i].option3,msg.questions[i].option4],(err, response)=>{
    //                         if(err){
    //                             console.log(err);
    //                         }
    //                     })
    //                 }
    //                 callback(null, {success:true})
    //             }
    //         })
    //     }
    // })
};

exports.handle_request = handle_request;


