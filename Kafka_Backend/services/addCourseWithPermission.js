var {CourseModel, UserModel} = require('../MongoDbConnection')

function handle_request(msg, callback){

    CourseModel.findOne({_id: msg.course_id, "permission_numbers.permission_id":msg.permNumber, "permission_numbers.is_used":false},  {total_waitlisted:1, total_enrolled:1, "permission_numbers.$":1}, function(err, findCourse){
        if(err || findCourse == null){
            console.log("perm not found")
            callback(null, {addCourseEnrollment:false})
        }else {
            UserModel.findOne({_id:msg.userid, "enrollment.course_id":msg.course_id, "enrollment.status":"WAITLIST"}, {"enrollment.$":1}, function(err, findUser){

                if(err || findUser == null){
                    console.log("user not found")
                    callback(null, {addCourseEnrollment:false})
                } else {
                    // update the course & the user.
                    findUser.enrollment[0].status = "ENROLL"
                    findCourse.total_enrolled += 1;
                    findCourse.total_waitlisted -= 1;
                    
                    CourseModel.update({_id:msg.course_id},{"$pull":{"permission_numbers":{"permission_id":msg.permNumber}}}, function(err,result){
                        if(err){
                            callback(null, {addCourseEnrollment:false})
                        } else {
                    findCourse.save(function(err,result){
                        if(err){
                            callback(null, {addCourseEnrollment:false})
                        } else {
                            UserModel.findOneAndUpdate({_id:msg.userid, "enrollment.course_id":msg.course_id,}, {"$set":{"enrollment.$.status":"ENROLL"}},function(err,result){
                                if(err){
                                    console.log("user update failed")
                                    callback(null, {addCourseEnrollment:false})
                                } else {

                                    callback(null, {addCourseEnrollment:true})
                                }
                            })
                        }
                    })
                    }   
                    })
                }
            })
        }
    })
    // mysqlconnection.query('UPDATE permission set is_used=1 where permission_id=? and course_id=?',[msg.permNumber,msg.course_id], (err, result)=>{
    //     if(err){
    //         console.log(err);
    //         res.send({addCourseEnrollment:false})
    //     }
    //     if (result.affectedRows == 1) {
    //         mysqlconnection.query('INSERT INTO enrollment(course_id, student_id, status) VALUES(?,?,?) ON DUPLICATE KEY UPDATE status="ENROLL"',[msg.course_id,msg.userid, "ENROLL"], (err, result) => {
    //             if(err){
    //                 console.log(err);
    //                 callback(null, {addCourseEnrollment:false})
    //             } 
    //         });
    //         mysqlconnection.query('UPDATE course SET total_enrolled = total_enrolled + 1 WHERE course_id = ?',[msg.course_id], (err, result) => {
    //             if(err){
    //                 console.log(err);
    //                 callback(null, {addCourseEnrollment:false})
    //             } 
    //             callback(null, {addCourseEnrollment:true})
    //         });
    //     } else {
    //         callback(null, {addCourseEnrollment:false})
    //     }
    // });
};

exports.handle_request = handle_request;


