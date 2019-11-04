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
    UserModel.findOne({_id:msg.studentid, "assignment_submissions.assignment_id":msg.assignmentid}, {"assignment_submissions.$":1}, (err, findUser)=>{
        if(err || findUser == null) {
            callback(null, {submissions:[]});
        } else {
            let subArray = [];
            findUser.assignment_submissions[0].submissions.forEach(element => {
                subArray.push({
                    timestamp:element.timestamp,
                    userfilename:element.user_filename,
                    submission_id:element._id
                })
            });
            callback(null, {submissions:subArray});
        }
    })
    // const query = "SELECT submission_id,user_filename, DATE_FORMAT(timestamp,'%b %d at %h:%i %p') as timestamp from assignment_submission S, assignment A WHERE A.assignment_id=S.assignment_id AND S.student_id=? AND S.assignment_id=? AND A.course_id=?;"
    // mysqlconnection.query(query,[msg.studentid, msg.assignmentid,msg.courseid],(err,rowsOfTable)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {submissions:[]});
    //     } else {
    //         let subArray = [];
    //         for (i=0;i<rowsOfTable.length;i++){
    //             subArray.push(
    //                 {
    //                     timestamp:rowsOfTable[i].timestamp,
    //                     userfilename:rowsOfTable[i].user_filename,
    //                     submission_id:rowsOfTable[i].submission_id
    //                 })
    //         }
    //         callback(null, {submissions:subArray});
    //     }});
};

exports.handle_request = handle_request;


