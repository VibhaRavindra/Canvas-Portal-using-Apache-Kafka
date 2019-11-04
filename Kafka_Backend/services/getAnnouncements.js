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
    CourseModel.findOne({_id:msg.courseid}, function(err, findCourse){
        if (err || findCourse == null) {
            callback(null,{announcements:[]});
        } else if(findCourse.announcements == null){
            callback(null,{announcements:[]});
        } else {
            let announcementsArray=[];
            for (i=0;i<findCourse.announcements.length;i++){
                announcementsArray.push({
                    id:findCourse.announcements[i]._id,
                    userid:findCourse.faculty_id,
                    title:findCourse.announcements[i].title,
                    content:findCourse.announcements[i].content,
                    timestamp:findCourse.announcements[i].timestamp
                })
            }
            callback(null, {announcements:announcementsArray});
        }  
    })

    // const query="SELECT announcementid, faculty_id, title, content, DATE_FORMAT(timestamp,'%b %d, %Y at %h:%i %p') as timestamp from announcements A, course C WHERE A.courseid=C.course_id AND A.courseid=? ORDER BY announcementid DESC;"
    // mysqlconnection.query(query,[msg.courseid],(err, rowsOfTable)=>{
    //     if(err){
    //         console.log(err)
    //         callback(null,{announcements:[]});
    //     } else {
    //         let announceArray=[];
    //         for(i=0;i<rowsOfTable.length;i++) {
    //             announceArray.push({
    //                 id:rowsOfTable[i].announcementid,
    //                 userid:rowsOfTable[i].faculty_id,
    //                 title:rowsOfTable[i].title,
    //                 content:rowsOfTable[i].content,
    //                 timestamp:rowsOfTable[i].timestamp
    //             })
    //         }
    //         callback(null, {announcements:announceArray});
    //     }
    // })
};

exports.handle_request = handle_request;


