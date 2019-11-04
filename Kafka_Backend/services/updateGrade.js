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
    UserModel.findOneAndUpdate({_id:msg.studentid,"assignment_submissions.assignment_id":msg.assignid},{"$set":{"assignment_submissions.$.latest_submission.grade":msg.grade, "assignment_submissions.$.latest_submission.isgraded":true}},(err, findUser)=>{
        if(err){
            console.log(err)
            callback(null, {success:false})
        }
        else
            callback(null, {success:true})
    });

    // UserModel.findOne({_id:msg.studentid,"assignment_submissions.assignment_id":msg.assignid}, {"assignment_submissions.$":1}, (err, findUser)=>{
    //     if(err || findUser == null) {
    //         console.log("No user found")
    //         callback(null, {success:false})
    //     } else {
    //         findUser.assignment_submissions[0].latest_submission.grade = msg.grade;
    //         findUser.save((err, findUser)=>{
    //             if(err){
    //                 console.log(err)
    //                 callback(null, {success:false})
    //             }
    //             else
    //                 callback(null, {success:true})
    //         })
    //     }
    // });
    // const query = "UPDATE assignment_submission SET isgraded=1, grade=? WHERE submission_id=?"
    // mysqlconnection.query(query,[msg.grade, msg.submissionid],(err, response)=>{
    //     if(err ){
    //         res.send({success:false})
    //     } else {
    //         res.send({success:true})
    //     }
    // })
};

exports.handle_request = handle_request;


