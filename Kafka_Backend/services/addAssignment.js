var {CourseModel} = require('../MongoDbConnection');
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

    CourseModel.findOne({_id:msg.courseid},{assignments:1}, function(err, course){
        if(err || course == null) {
            callback(null, {success:true})
        } else {
            if(course.assignments == null){
                course.assignments = []
            }
            course.assignments.push({
                course_id:msg.courseid,
                title:msg.title,
                points:msg.points
            })
            course.save((err, result)=>{
                if(err)
                callback(null, {success:false})
                else
                callback(null, {success:true})
            })
        }
    })
    // const query = "INSERT INTO assignment(course_id,title,points) VALUES(?,?,?)"
    // mysqlconnection.query(query,[msg.courseid,msg.title,msg.points],(err,response)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {success:false})
    //     } else {
    //         callback(null, {success:true})
    //     }
    // });
};

exports.handle_request = handle_request;


