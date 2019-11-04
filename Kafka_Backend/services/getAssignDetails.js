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
    CourseModel.findOne({"assignments._id":msg.assignid},{"assignments.$":1}, (err, findAssign)=>{
        if(err || findAssign == null) {
            callback(null, {})
        } else {
            callback(null, {
                name:findAssign.assignments[0].title, 
                points:findAssign.assignments[0].points
            })
        }
    })
    // const query = "SELECT title, points from assignment where assignment_id=?"
    // mysqlconnection.query(query,[msg.assignid],(err, rowsOfTable)=>{
    //     if(err || rowsOfTable.length !=1){
    //         console.log(err)
    //         callback(null, {})
    //     } else {
    //         callback(null, {
    //             name:rowsOfTable[0].title, 
    //             points:rowsOfTable[0].points
    //         })
    //     }
    // })
};

exports.handle_request = handle_request;


