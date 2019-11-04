var {CourseModel, UserModel} = require('../MongoDbConnection');

function handle_request(msg, callback){

    CourseModel.findOne({_id:msg.course_id}, function(err, findCourse){
        
        if (err|| findCourse == null) {
            console.log(err)
            console.log("findCourse:" + findCourse)
            callback(null, {dropCourseEnrollment:false})
        }else{
            console.log("Course found")
            findCourse.total_enrolled -= 1;
            findCourse.save(function (err, result) {
                if (err) {
                    callback(null, {dropCourseEnrollment:false})
                }else{
                    UserModel.update({ _id: msg.userid }, { "$pull": { "enrollment": { "course_id": msg.course_id } }}, function(err, dropCourse) {
                        if (err) {
                            callback(null, {dropCourseEnrollment:false})
                        }else{
                            callback(null, {dropCourseEnrollment:true})
                        }
                    });
                }
            });  
        }
    })




    // mysqlconnection.query('DELETE from enrollment WHERE course_id = ? AND student_id = ?',[msg.courseid, msg.userid], (err, result) => {
    //     if(err){
    //         console.log(err);
    //         callback(null, {dropCourseEnrollment:false})
    //     } else {
    //         mysqlconnection.query('UPDATE course SET total_enrolled = total_enrolled - 1 WHERE course_id = ?',[msg.courseid], (err, result) => {
    //             if(err){
    //                 console.log(err);
    //                 callback(null, {dropCourseEnrollment:false})
    //             } else {
    //                 mysqlconnection.query('SELECT enrollment_id from enrollment where course_id=? AND status=? ORDER BY enrollment_id ASC LIMIT 1',[msg.courseid, "WAITLIST"],(err, rowsOfTable)=>{
    //                     if(err){
    //                         console.log(err);
    //                         callback(null, {dropCourseEnrollment:false})
    //                     } else {
    //                     if(rowsOfTable.length == 1){
    //                         mysqlconnection.query('UPDATE enrollment SET status="ENROLL" where enrollment_id=?;',[rowsOfTable[0].enrollment_id],(err, rowsOfTable)=>{
    //                             if(err){
    //                                 console.log(err);
    //                             }
    //                         });
    //                         mysqlconnection.query('UPDATE course SET total_enrolled = total_enrolled + 1, total_waitlisted=total_waitlisted-1 WHERE course_id = ?',[msg.courseid], (err, result) => {
    //                             if(err){
    //                                 console.log(err);
    //                             } 
    //                         });
    //                     }
    //                     callback(null, {dropCourseEnrollment:true})
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });
};

exports.handle_request = handle_request;


