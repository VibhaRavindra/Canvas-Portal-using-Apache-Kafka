var {UserModel} = require('../MongoDbConnection');
function handle_request(msg, callback){
    let condition = {course_handled:msg.courseid}
    if (msg.role === "student"){
        condition = { enrollment:{ $elemMatch :{ course_id: msg.courseid, status:"ENROLL" }}}
    } else if(msg.role == "all"){
        condition = {$or: [{enrollment:{ $elemMatch :{ course_id: msg.courseid, status:"ENROLL" }}}, {course_handled:msg.courseid}]}
    }
    UserModel.find(condition,function(err, findUsers){
        if(err || findUsers == null){
            callback(null, {people:[]})
        }else{
            let peopleArray=[];
            for (var i=0; i<findUsers.length; i++){
                peopleArray.push({
                    id:findUsers[i]._id,
                    name:findUsers[i].name,
                    role:findUsers[i].role,
                })
            }
            callback(null, {people:peopleArray})
        }
    })

    

    // const query = "SELECT U.user_id, U.user_name, U.role from enrollment E, users U WHERE E.student_id=U.user_id AND E.course_id=? UNION SELECT U.user_id, U.user_name, U.role from course C, users U WHERE C.faculty_id=U.user_id AND C.course_id=?"
    // mysqlconnection.query(query,[msg.courseid, msg.courseid],(err, rowsOfTable)=>{
    //     if(err){
    //         console.log(err)
    //         callback(null, {people:[]})
    //     } else {
    //         let peopleArray=[];
    //         for(i=0;i<rowsOfTable.length;i++) {
    //             peopleArray.push({
    //                 id:rowsOfTable[i].user_id,
    //                 name:rowsOfTable[i].user_name,
    //                 role:rowsOfTable[i].role,
    //             })
    //         }
    //         callback(null, {people:peopleArray})
    //     }
    // })
};

exports.handle_request = handle_request;


