var {CourseModel} = require('../MongoDbConnection')
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
    CourseModel.findOne({_id:msg.courseid},{assignments:1}, (err, findAssign)=>{
        if(err || findAssign == null) {
            console.log(err);
            callback(null, {assignments:[]})
        } else {
            let assignArray = [];
            findAssign.assignments.forEach(assign => {
                assignArray.push(
                    {
                        id:assign._id,
                        name:assign.title,
                        points:assign.points
                    })
            });
            callback(null, {assignments:assignArray})
        }
    })

    // const query = "SELECT assignment_id, title, points from assignment WHERE course_id=?";
    // mysqlconnection.query(query,[msg.courseid],(err, rowsOfTable)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {assignments:[]})
    //     } else {
    //         let assignArray = [];
    //         for (i=0;i<rowsOfTable.length;i++){
    //             assignArray.push(
    //                 {
    //                     id:rowsOfTable[i].assignment_id,
    //                     name:rowsOfTable[i].title,
    //                     points:rowsOfTable[i].points
    //                 })
    //         }
    //         callback(null, {assignments:assignArray})
    //     }
    // })
};

exports.handle_request = handle_request;


