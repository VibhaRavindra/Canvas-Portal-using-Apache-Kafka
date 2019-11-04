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
    CourseModel.findOne({_id:msg.courseid}, {files:1}, function(err, result) {
        if(err) {
            callback(null, {files:[]})
        } else {
            let fileArray = [];
            for(i=0; i<result.files.length;i++){
                fileArray.push({
                    fileid: result.files[i]._id,
                    filename: result.files[i].filename,
                    uploaded_timestamp: result.files[i].timestamp,
                    size: result.files[i].size,
                    user_name: result.files[i].created_by
                })
            }
            callback(null, {files:fileArray})
        }
    })
    // const query ="SELECT fileid,filename,DATE_FORMAT(uploaded_timestamp,'%b %d, %Y') as uploaded_timestamp,size,user_name from course_files C, course CC, users U  WHERE C.course_id=? AND C.course_id=CC.course_id AND CC.faculty_id=U.user_id;"
    // mysqlconnection.query(query,[msg.courseid],(err, rowsOfTable)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {files:[]})
    //     } else {
    //         let fileArray = [];
    //         for (i=0;i<rowsOfTable.length;i++){
    //             fileArray.push(
    //                 {
    //                     fileid:rowsOfTable[i].fileid,
    //                     filename:rowsOfTable[i].filename,
    //                     uploaded_timestamp:rowsOfTable[i].uploaded_timestamp,
    //                     size:rowsOfTable[i].size,
    //                     user_name:rowsOfTable[i].user_name
    //                 })
    //         }
    //         callback(null, {files:fileArray})
    //     }
    // })
};

exports.handle_request = handle_request;


