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
            callback(null, {addCourseEnrollment:false})
        }else{
            findCourse.total_enrolled += 1;
            findCourse.save(function (err, result) {
                if (err) {
                    callback(null, {addCourseEnrollment:false})
                }else{
                    UserModel.findOne({_id:msg.userid}, function(err, findUser){
                        if(err || findUser == null) {
                            callback(null, {addCourseEnrollment:false})
                            throw err;
                        } else {   
                            if (findUser.enrollment == null) {
                                // making new array
                                findUser.enrollment = {
                                    course_id: findCourse._id, 
                                    status: "ENROLL"
                                }
                            } else {
                                // adding to existing array
                                findUser.enrollment.push({
                                    course_id: findCourse._id, 
                                    status: "ENROLL"
                                })
                            }
                            findUser.save(function (err, result) {
                                if (err) {
                                    console.log(err)
                                    callback(null, {addCourseEnrollment:false})
                                }else{
                                    callback(null, {addCourseEnrollment:true})
                                }
                            });
                        }

                    })
                }
            });  
        }
    }) 

    // mysqlconnection.query('INSERT INTO enrollment(course_id, student_id, status) VALUES(?,?,?) ON DUPLICATE KEY UPDATE status="ENROLL"',[msg.course_id,msg.userid, "ENROLL"], (err, result) => {
    //     if(err){
    //         console.log(err);
    //         callback(null, {addCourseEnrollment:false})
    //     } 
    // });
    // mysqlconnection.query('UPDATE course SET total_enrolled = total_enrolled + 1 WHERE course_id = ?',[msg.course_id], (err, result) => {
    //     if(err){
    //         console.log(err);
    //         callback(null, {addCourseEnrollment:false})
    //     } 
    //     callback(null, {addCourseEnrollment:true})
    // });
};

exports.handle_request = handle_request;


