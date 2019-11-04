var {UserModel, SubmissionDetails, CourseModel, AssignmentSubmissionSchema} = require('../MongoDbConnection');
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
    UserModel.findOne({_id:msg.studentid}, {assignment_submissions:1}, (err, findUser)=>{
        if(err || findUser == null) {
            callback(null, {success:false})
        } else {
            const cur_submission = {
                grade: 0,
                localfilename: msg.localfilename,
                user_filename: msg.userfilename,
                isgraded: false,
                timestamp: new Date()
            }
            let found = false
            if(findUser.assignment_submissions != null){
                findUser.assignment_submissions.forEach(assign_subs => {
                    if(assign_subs.assignment_id == msg.assignmentid) {
                        console.log("user had a submission for the course.")
                        found = true;
                        assign_subs.submissions.push(cur_submission)
                        assign_subs.latest_submission.grade = 0
                        assign_subs.latest_submission.localfilename = msg.localfilename
                        assign_subs.latest_submission.user_filename = msg.userfilename
                        assign_subs.latest_submission.isgraded = false
                        assign_subs.latest_submission.timestamp = new Date()
                    }
                });
            }
            if(found){
                findUser.save((err, result)=>{
                    if(err){
                        callback(null, {success:false})
                    } else {
                        callback(null, {success:true})
                    }
                })    
            }else{
                console.log("user does not have a submission for the course.")
                // need to fetch all assignment details and add it to the user doc.
                CourseModel.findOne({"assignments._id":msg.assignmentid}, {"assignments.$":1},(err, findCourse)=>{
                    if(err || findCourse == null) {
                        console.log("err or null" + err)
                        callback(null, {success:false})
                    } else {
                        if(findUser.assignment_submissions == null){

                            findUser.assignment_submissions = []
                        }
                        console.log("findCourse:" + findCourse)
                        const cur_assign_submission = {
                            course_id: findCourse._id,
                            assignment_id: findCourse.assignments[0]._id,
                            assignment_title: findCourse.assignments[0].title,
                            total_points: findCourse.assignments[0].points,
                            latest_submission: cur_submission,
                            submissions: [cur_submission]
                        }
                        findUser.assignment_submissions.push(cur_assign_submission)
                        findUser.save((err, result)=>{
                            if(err){
                                callback(null, {success:false})
                            } else {
                                callback(null, {success:true})
                            }
                        })            
                    }
                })
            }
        }
    })
    // const query = "INSERT INTO assignment_submission(assignment_id,student_id,localfilename,user_filename) VALUES(?,?,?,?);"
    // mysqlconnection.query(query,[msg.assignmentid, msg.studentid, msg.localfilename, msg.userfilename],(err,response)=>{
    //     if(err){
    //         console.log(err)
    //         callback(null, {success:false})
    //     } else {
    //         callback(null, {success:true})
    //     }
    // })
};

exports.handle_request = handle_request;


