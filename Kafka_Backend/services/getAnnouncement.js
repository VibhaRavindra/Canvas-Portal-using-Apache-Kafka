// const mysql = require('mysql');
var {CourseModel} = require('../MongoDbConnection');
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

    CourseModel.findOne({ announcements: { $elemMatch: { _id: msg.announceid } } }, function(err, findCourse){
        if (err || findCourse == null) {
            console.log("findCourse == null")
            callback(null, {CourseModel});
        } else if(findCourse.announcements == null){
            callback(null, {});
        } else {
            console.log("findCourse.announcements != null")
            for(var i=0;i<findCourse.announcements.length;i++){
                if(findCourse.announcements[i]._id == msg.announceid){
                    console.log("findCourse.announcements[i]._id == msg.announceid")
                    callback(null,{
                        userid:findCourse.faculty_id,
                        username:findCourse.faculty_name,
                        title:findCourse.announcements[i].title,
                        content:findCourse.announcements[i].content,
                        timestamp:findCourse.announcements[i].timestamp
                    })
                } else {
                    callback(null, {});
                }
            }
        }  
    })

    // const query="SELECT user_name, faculty_id, title, content, DATE_FORMAT(timestamp,'%b %d, %Y at %h:%i %p') as timestamp from announcements A, course C, users U WHERE A.courseid=C.course_id AND A.announcementid=? AND C.faculty_id=U.user_id;"
    // mysqlconnection.query(query,[msg.announceid],(err,rowsOfTable)=>{
    //     if(err || rowsOfTable.length!=1){
    //         console.log(err);
    //         callback(null, {});
    //     } else {
    //         callback(null,{
    //             userid:rowsOfTable[0].faculty_id,
    //             username:rowsOfTable[0].user_name,
    //             title:rowsOfTable[0].title,
    //             content:rowsOfTable[0].content,
    //             timestamp:rowsOfTable[0].timestamp
    //         })
    //     }
    // })
};

exports.handle_request = handle_request;


