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
// todo: FIX THIS LATER. NOT RETURNING CORRECT ORDER.
function handle_request(msg, callback){
    console.log("Inside getCourses")
    if (!msg.isStudent) {
        CourseModel.find({faculty_id:msg.userid}, function(err, findCourse){
            if (err) {
                callback(null, {courseList:[]})
            }
            if(findCourse == null){
                callback(null, {courseList:[]}) 
            }else{
                let courseArray={};
                for (i=0;i<findCourse.length;i++){
                    courseArray[findCourse[i]._id]={
                        course_id:findCourse[i]._id,
                        dept_id:findCourse[i].dept_id,
                        course_number:findCourse[i].course_id,
                        course_name:findCourse[i].course_name,
                        term_name:findCourse[i].term
                    }
                }
                console.log(courseArray)
                // order the courses correctly
                UserModel.find({_id:msg.userid},{course_order:1},(err,findUser)=>{
                    if(err || findUser==null || findUser.length ==0|| findUser[0].course_order == null || findUser[0].course_order.length === 0) {
                        callback(null, {courseList:Object.values(courseArray)}) 
                    } else {
                        let newCourseArray = []
                        findUser[0].course_order.forEach((courseid)=>{
                            if(courseArray[courseid]) {
                                newCourseArray.push(courseArray[courseid])
                                delete courseArray[courseid]
                            }
                        })
                        callback(null, {courseList:newCourseArray.concat(Object.values(courseArray))}) 
                    }
                })
                
            }
        })  
    } else {
        UserModel.find({ _id: msg.userid}, function(err, findUser) {
            let courseIdArray = [];
            if (err) {
                callback(null, {courseList:[]}) 
            }else if(findUser == null || findUser.length==0){
                callback(null, {courseList:[]})
            }else{
                for(var i=0; i<findUser[0].enrollment.length;i++){
                    if(findUser[0].enrollment[i].status == "ENROLL"){
                        courseIdArray.push(findUser[0].enrollment[i].course_id);
                    }
                }
                CourseModel.find({_id:courseIdArray}, function(err, findCourse){
                    if (err || findCourse == null) {
                        console.log(err)
                        callback(null, {courseList:[]}) 
                    }else {
                        let courseArray={};
                        for (let i=0;i<findCourse.length;i++){
                            courseArray[findCourse[i]._id] = {
                                course_id:findCourse[i]._id,
                                dept_id:findCourse[i].dept_id,
                                course_number:findCourse[i].course_id,
                                course_name:findCourse[i].course_name,
                                term_name:findCourse[i].term
                            }
                        }
                        console.log(courseArray)
                        if(findUser[0].course_order == null || findUser[0].course_order.length === 0) {
                            console.log("No course order")
                            callback(null, {courseList:Object.values(courseArray)})
                        } else {
                            let newCourseArray = []
                            findUser[0].course_order.forEach((courseid)=>{
                            if(courseArray[courseid]) {
                                newCourseArray.push(courseArray[courseid])
                                console.log("found courseid " + courseid)
                                delete courseArray[courseid]
                            }
                        })
                            callback(null, {courseList:newCourseArray.concat(Object.values(courseArray))})
                        }
                    }
                })
            }
        });
    }

    

    // let query = 'SELECT C.dept_id, C.course_number, C.course_name, C.course_id, C.faculty_id, T.term_name FROM enrollment E, course C, term T WHERE C.course_id = E.course_id AND E.student_id = ? AND E.status = "ENROLL" AND C.term_id = T.term_id;'
    // if (!msg.isStudent) {
    //     query = 'SELECT C.dept_id, C.course_number, C.course_name, C.course_id, C.faculty_id, T.term_name FROM course C, term T WHERE C.faculty_id = ? AND C.term_id = T.term_id;'
    // }
    // mysqlconnection.query(query,[msg.userid], (err, rowsOfTable) => {
    //     if(err){
    //         console.log(err);
    //         callback(null, {courseList:[]})
    //     } 
    //     let courseArray=[];
    //     for (i=0;i<rowsOfTable.length;i++){
    //         courseArray.push({
    //             course_id:rowsOfTable[i].course_id,
    //             dept_id:rowsOfTable[i].dept_id,
    //             course_number:rowsOfTable[i].course_number,
    //             course_name:rowsOfTable[i].course_name,
    //             term_name:rowsOfTable[i].term_name
    //         })
    //     }
    //     callback(null, {courseList:courseArray})
    //     // res.send({courseList:courseArray,isStudent:req.session.isStudent})
    // });
};

exports.handle_request = handle_request;


