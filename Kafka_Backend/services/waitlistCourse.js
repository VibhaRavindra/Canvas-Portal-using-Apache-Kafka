// const mysql = require('mysql');
var {CourseModel, UserModel} = require('../MongoDbConnection');
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

    CourseModel.findOne({_id:msg.course_id}, function(err, findCourse){
        
        if (err|| findCourse == null) {
            callback(null, {waitlistCourse:false})
        }else{
            findCourse.total_waitlisted += 1;
            findCourse.save(function (err, result) {
                if (err) {
                    callback(null, {waitlistCourse:false})
                }else{
                    UserModel.findOne({_id:msg.userid}, function(err, findUser){
                        if(err || findUser == null) {
                            callback(null, {waitlistCourse:false})
                            throw err;
                        } else {   
                            if (findUser.enrollment == null) {
                                // making new array
                                findUser.enrollment = {
                                    course_id: findCourse._id, 
                                    status: "WAITLIST"
                                }
                            } else {
                                // adding to existing array
                                findUser.enrollment.push({
                                    course_id: findCourse._id, 
                                    status: "WAITLIST"
                                })
                            }
                            findUser.save(function (err, result) {
                                if (err) {
                                    console.log(err)
                                    callback(null, {waitlistCourse:false})
                                }else{
                                    callback(null, {waitlistCourse:true})
                                }
                            });
                        }

                    })
                }
            });  
        }
    }) 

    // mysqlconnection.query('INSERT INTO enrollment(course_id, student_id, status) VALUES(?,?,?) ON DUPLICATE KEY UPDATE status="WAITLIST"',[msg.course_id, msg.userid, "WAITLIST"], (err, result) => {
    //     if(err){
    //         console.log(err);
    //         callback(null, {waitlistCourse:false})
    //     } 
    // });
    // mysqlconnection.query('UPDATE course SET total_waitlisted = total_waitlisted + 1 WHERE course_id = ?',[msg.course_id], (err, result) => {
    //     if(err){
    //         console.log(err);
    //         callback(null, {waitlistCourse:false})
    //     } 
    //     callback(null, {waitlistCourse:true})
    // });
};

exports.handle_request = handle_request;


