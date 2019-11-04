// this is for a faculty to grade all user's submissions.
var {UserModel} = require('../MongoDbConnection')
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
    UserModel.find({"assignment_submissions.assignment_id":msg.assignmentid},{"assignment_submissions.$":1, name:1}, function(err, findUsers){
        if(err || findUsers == null) {
            callback(null, {submissions:[]})
        } else {
            let subArray = [];
            findUsers.forEach(findUser => {
                const submission = findUser.assignment_submissions[0].latest_submission
                subArray.push(
                    {
                        student_id:findUser._id,
                        submission_id:submission._id,
                        user_name:findUser.name,
                        user_filename:submission.user_filename,
                        timestamp:submission.timestamp,
                        grade:submission.grade,
                        localfilename: submission.localfilename
                    })
            });
            callback(null, {submissions:subArray})
        }
    })

    // const query = "SELECT S.student_id,S.submission_id,user_name,user_filename,`timestamp`,grade FROM assignment_submission S, (SELECT student_id,MAX(submission_id) as submission_id from assignment_submission WHERE assignment_id=? GROUP BY student_id) AS A, users U WHERE A.submission_id=S.submission_id AND U.user_id=S.student_id;"
    // mysqlconnection.query(query,[msg.assignmentid],(err, rowsOfTable)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {submissions:[]})
    //     } else {
    //         let subArray = [];
    //         for (i=0;i<rowsOfTable.length;i++){
    //             subArray.push(
    //                 {
    //                     student_id:rowsOfTable[i].student_id,
    //                     submission_id:rowsOfTable[i].submission_id,
    //                     user_name:rowsOfTable[i].user_name,
    //                     user_filename:rowsOfTable[i].user_filename,
    //                     timestamp:rowsOfTable[i].timestamp,
    //                     grade:rowsOfTable[i].grade
    //                 })
    //         }
    //         callback(null, {submissions:subArray})
    //     }
    // })
};

exports.handle_request = handle_request;


