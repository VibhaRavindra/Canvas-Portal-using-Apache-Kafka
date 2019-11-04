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

    CourseModel.findOne({_id: msg.courseid}, function(err, findCourse){
        if (err) {
            callback(null, {courseEnrollment:[]})
        }
        if(findCourse == null){
            callback(null, {courseEnrollment:[]})
        }else{
            let courseStatus = "";
            var courseEnrollmentArray = [];
            const courseStatusCalc = findCourse.capacity - findCourse.total_enrolled;
            if(courseStatusCalc > 0){
                courseStatus = "open"
            }else if(courseStatusCalc <= 0 && findCourse.waitlist_capacity > findCourse.total_waitlisted){
                courseStatus = "waitlist"
            }else if(courseStatusCalc <= 0 && findCourse.waitlist_capacity == findCourse.total_waitlisted){
                courseStatus = "closed"
            }
            let studentStatus = "NEW";
            UserModel.findOne({_id: msg.userid, "enrollment.course_id":msg.courseid},{_id: 0,"enrollment.$":1}, function(err, findUser){
                console.log("find User: " + findUser)
                if(findUser!=null && findUser.enrollment != null){
                    studentStatus = findUser.enrollment[0].status
                }
                courseEnrollmentArray.push({
                    course_id: findCourse._id, 
                    course_number: findCourse.course_id,course_name:findCourse.course_name,capacity:findCourse.capacity,total_enrolled:findCourse.total_enrolled,total_waitlisted:findCourse.total_waitlisted, courseStatus: courseStatus,
                    studentStatus: studentStatus
                });
                callback(null, {courseEnrollment:courseEnrollmentArray})
            })
        }
    })

    // mysqlconnection.query('SELECT A.*, B.status FROM course AS A LEFT JOIN enrollment AS B ON A.course_id = B.course_id AND B.student_id = ?  WHERE A.course_id = ?;',[msg.userid, msg.courseid], (err, rowsOfTable, fieldsOfTable) => {
    //     if(err){
    //         console.log(err);
    //         callback(null, {courseEnrollment:[]})
    //     } 
    //     //console.log(rowsOfTable);
    //     for(i=0; i < rowsOfTable.length; i++) {
    //     var courseEnrollmentArray = [];
    //     let courseStatus = "";
    //     const courseStatusCalc = rowsOfTable[0].capacity - rowsOfTable[0].total_enrolled;
    //     if(courseStatusCalc > 0){
    //         courseStatus = "open"
    //     }else if(courseStatusCalc <= 0 && rowsOfTable[0].waitlist_capacity > rowsOfTable[0].total_waitlisted){
    //         courseStatus = "waitlist"
    //     }else if(courseStatusCalc <= 0 && rowsOfTable[0].waitlist_capacity == rowsOfTable[0].total_waitlisted){
    //         courseStatus = "closed"
    //     }
    //     let studentStatus = "NEW";
    //     if(rowsOfTable[0].status != null) {
    //         studentStatus = rowsOfTable[0].status;
    //     }
    //     courseEnrollmentArray.push({course_id: rowsOfTable[0].course_id, course_number: rowsOfTable[0].course_number,course_name:rowsOfTable[0].course_name,capacity:rowsOfTable[0].capacity,total_enrolled:rowsOfTable[0].total_enrolled,total_waitlisted:rowsOfTable[0].total_waitlisted, courseStatus: courseStatus, studentStatus: studentStatus});
    //     }
    //     callback(null, {courseEnrollment:courseEnrollmentArray})
    // });
};

exports.handle_request = handle_request;


