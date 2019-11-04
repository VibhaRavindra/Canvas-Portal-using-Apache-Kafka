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
    CourseModel.findOne({_id:msg.courseid}, function(err, findCourse){
        let facultyname, facultyemail;
        if (err|| findCourse == null) {
            callback(null, {});
        }else{
            UserModel.findOne({_id:findCourse.faculty_id}, function(err, findUser){
                if (err || findUser == null) {
                    callback(null, {});
                }else{
                    facultyname = findUser.name;
                    facultyemail = findUser.email;
                    callback(null, {
                        term_name:findCourse.term,
                        dept_id:findCourse.dept_id,
                        course_number:findCourse.course_id,
                        course_name:findCourse.course_name,
                        faculty_name:facultyname,
                        faculty_email:facultyemail,
                        room:findCourse.course_room,
                        desc:findCourse.course_desc,
                        total_waitlisted: findCourse.total_waitlisted
                    })
                }
            }) 
        }
    })


    // const query = 'SELECT T.term_name, U.user_name, U.user_email, C.total_waitlisted, C.course_room, c.course_desc, C.dept_id, C.course_number, C.course_name from course C, users U, term T where C.faculty_id=U.user_id AND C.term_id=T.term_id AND C.course_id=?'
    // mysqlconnection.query(query,[msg.courseid], (err, rowsOfTable)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {});
    //     }
    //     callback(null, {
    //         term_name:rowsOfTable[0].term_name,
    //         dept_id:rowsOfTable[0].dept_id,
    //         course_number:rowsOfTable[0].course_number,
    //         course_name:rowsOfTable[0].course_name,
    //         faculty_name:rowsOfTable[0].user_name,
    //         faculty_email:rowsOfTable[0].user_email,
    //         room:rowsOfTable[0].course_room,
    //         desc:rowsOfTable[0].course_desc,
    //         total_waitlisted: rowsOfTable[0].total_waitlisted
    //     });
    // });
};

exports.handle_request = handle_request;


