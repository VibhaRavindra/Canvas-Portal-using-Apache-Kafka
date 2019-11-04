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
    console.log("adding annouce")
    CourseModel.findOne({_id:msg.courseid}, function(err, findCourse){
        if (err || findCourse == null) {
            callback(null,{success:false})
        } else {
            let currentTime = new Date();;
            console.log(currentTime.toLocaleString());
            if(findCourse.announcements == null){
                console.log("add first announce")
                findCourse.announcements = [{
                    title: msg.title, 
                    content: msg.content,
                    timestamp: currentTime
                }]
            } else {
                console.log("add not-first announce")
                // adding to existing array
                findCourse.announcements.push({
                    title: msg.title, 
                    content: msg.content,
                    timestamp: currentTime
                })
            }
            findCourse.save(function (err, result) {
                if (err) {
                    console.log(err)
                    callback(null,{success:false})
                }else{
                    console.log("saved announce")
                    callback(null,{success:true})
                }
            });
        } 
        
    })

    // const query = "INSERT INTO announcements(courseid,title,content) VALUES(?,?,?)"
    // mysqlconnection.query(query,[msg.courseid,msg.title,msg.content],(err,response)=>{
    //     if(err){
    //         console.log(err)
    //         callback(null,{success:false})
    //     } else {
    //         callback(null,{success:true})
    //     }
    // })
};

exports.handle_request = handle_request;


