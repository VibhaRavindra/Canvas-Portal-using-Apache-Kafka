const bcrypt = require('bcrypt');
const saltRounds = 10;
const mysql = require('mysql');
const uuidv4 = require('uuid/v4');
const userimage  =require('./defaultUserImage');
var fs = require('fs');

// This is the code to run as without connection pooling
// var mysqlconnection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "rootPassword",
//     database: "Canvas"
//   });
  
//   mysqlconnection.connect(err => {
//     if (err) 
//     throw err;
//     console.log("Mysql successfully connected!");
//   })

// This is the code to run as a connection pool
var mysqlconnection = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'rootPassword',
    database: 'Canvas'
})

exports.addUser  = async function(usrname, email, pw, employee, res) {
    console.log("username "+usrname)
    console.log("email "+email)
    console.log("pw "+pw)
    console.log("employee "+employee)
    console.log("saltRounds "+saltRounds)
    let hashpw = bcrypt.hashSync(pw, saltRounds);
    mysqlconnection.query('INSERT INTO users (user_email , user_name, role, password) VALUES(?,?,?,?)',[email, usrname, employee, hashpw], (err, result) => {
        if(err){
            res.send({isInvalid: true, errMessage: "Sign Up Failed"})
        } else {
            res.send({isInvalid: false})
        }
        });
}
exports.validateUser  = async function(req, res) {
    //console.log(req.body.emailId)
    mysqlconnection.query('SELECT * FROM users WHERE user_email=?',[req.body.emailId], 
    function(err, rowsOfTable, fieldsOfTable){
        if(err){
            res.send({IsInvalid: true, isLoggedIn: false, errMessage: "Sign In Failed"})
        }
        // console.log("rowsOfTable"+rowsOfTable)
        var UserArray = [];
        if(rowsOfTable.length == 1){
        var result = bcrypt.compareSync(req.body.password, rowsOfTable[0].password);
        if(result){
            req.session.IsLoggedIn = true;
            req.session.userid = rowsOfTable[0].user_id;
            req.session.isStudent = rowsOfTable[0].role == 'student';
            // console.log('Is student : '+req.session.isStudent);
            // console.log('userid : '+req.session.userid);
            res.send({IsInvalid: false, isLoggedIn: true,
                isStudent:req.session.isStudent,
                userid:req.session.userid});
        }else{
            res.send({IsInvalid: true, isLoggedIn: false, errMessage: "Sign In Failed"})
        }
        }else{
            res.send({IsInvalid: true, isLoggedIn: false, errMessage: "No such user"})
        }
    })
}
exports.getProfileData = async function(userid, res) {
    query = 'SELECT * from users where user_id=?'
    mysqlconnection.query(query,[userid],(err,rowsOfTable)=>{
        if(err){
            console.log(err);
            res.send({success:false})
        }else if(rowsOfTable.length ==1){
            res.send({success:true, 
                name:rowsOfTable[0].user_name,
                email:rowsOfTable[0].user_email,
                phonenumber:rowsOfTable[0].phonenumber,
                aboutme:rowsOfTable[0].about_me,
                city:rowsOfTable[0].city,
                country:rowsOfTable[0].country,
                company:rowsOfTable[0].company,
                school:rowsOfTable[0].school,
                hometown:rowsOfTable[0].hometown,
                languages:rowsOfTable[0].languages,
                gender:rowsOfTable[0].gender
            })
        } else{
            res.send({success:false})
        }
    });
}
exports.getCourseDetails = async function(req, res) {
    const courseid = req.params.courseid;
    const query = 'SELECT T.term_name, U.user_name, U.user_email, C.total_waitlisted, C.course_room, c.course_desc, C.dept_id, C.course_number, C.course_name from course C, users U, term T where C.faculty_id=U.user_id AND C.term_id=T.term_id AND C.course_id=?'
    mysqlconnection.query(query,[courseid], (err, rowsOfTable)=>{
        if(err){
            console.log(err);
            res.send({})
        }
        res.send({
            term_name:rowsOfTable[0].term_name,
            dept_id:rowsOfTable[0].dept_id,
            course_number:rowsOfTable[0].course_number,
            course_name:rowsOfTable[0].course_name,
            faculty_name:rowsOfTable[0].user_name,
            faculty_email:rowsOfTable[0].user_email,
            room:rowsOfTable[0].course_room,
            desc:rowsOfTable[0].course_desc,
            total_waitlisted: rowsOfTable[0].total_waitlisted,
        })
    });
}
exports.getDepartment  = async function(res) {
    mysqlconnection.query('SELECT * from department', (err, rowsOfTable, fieldsOfTable) => {
        if(err){
            console.log(err);
            res.send({department:[]})
        } 
        var DepartmentArray = [];
        for (var i=0; i<rowsOfTable.length; i++){
            DepartmentArray.push({value: rowsOfTable[i].dept_id, departmentName: rowsOfTable[i].dept_name});
        }
        res.send({department:DepartmentArray});
    });
}
exports.getTerm  = async function(res) {
    mysqlconnection.query('SELECT * from term', (err, rowsOfTable, fieldsOfTable) => {
        if(err){
            console.log(err);
            res.send({terms:[]})
        } 
        var TermArray = [];
        for (var i=0; i<rowsOfTable.length; i++){
            TermArray.push({value: rowsOfTable[i].term_id, term: rowsOfTable[i].term_name});
        }
        res.send({terms:TermArray});
    });
}

exports.searchCourses  = async function(req, res) {
    const term = req.body.term;
    const dept = req.body.department;
    const condition = req.body.condition;
    const courseNumber = req.body.courseNumber;
    const courseName = req.body.courseName;
    let query = "";
    let params =[];
    if (courseNumber == "" && courseName == "") {
        console.log("showing all courses for the dept and term");
        query = "SELECT * from course c, users u WHERE c.faculty_id=u.user_id AND c.dept_id=? AND c.term_id=?";
        params = [dept, term];
    } else if(courseNumber == "") {
        console.log("seraching for courses by name");
        const courseNameSearch = "%" + courseName + "%"
        query ='SELECT * from course c, users u WHERE c.faculty_id=u.user_id AND c.dept_id=? AND c.term_id=? AND c.course_name LIKE ? COLLATE utf8_general_ci';
        params = [dept, term, courseNameSearch];
    } else if (courseName == "") {
        console.log("searching for courses by number & condition");
        query = "SELECT * from course c, users u WHERE c.faculty_id=u.user_id AND c.dept_id=? AND c.term_id=? AND c.course_number"
        switch(condition) {
            case "greater":
                query += ">=?";
                break;
            case "exactly":
                query += "=?";
                break;
            case "lesser":
                query += "<=?";
                break;
        }
        params = [dept, term, courseNumber];
    } else {
        console.log("searching for courses by name, number & condition");
        const courseNameSearch = "%" + courseName + "%"
        query ='SELECT * from course c, users u WHERE c.faculty_id=u.user_id AND c.dept_id=? AND c.term_id=? AND c.course_name LIKE ? AND c.course_number'
        switch(condition) {
            case "greater":
                query += ">=?";
                break;
            case "exactly":
                query += "=?";
                break;
            case "lesser":
                query += "<=?";
                break;
        }
        query += ' COLLATE utf8_general_ci;'
        params = [dept, term, courseNameSearch, courseNumber];
    }
    // console.log("query "+ query)
    // console.log("params "+ params)
    mysqlconnection.query(query, params, (err, rowsOfTable, fieldsOfTable) => {
        if(err){
            console.log(err);
            res.send({courses:[]})
        } 
        var CourseArray = [];
        for(i=0; i < rowsOfTable.length; i++) {
            const cap = rowsOfTable[i].capacity;
            const wait_cap = rowsOfTable[i].waitlist_capacity;
            const enrolled = rowsOfTable[i].total_enrolled;
            const total_waitlisted = rowsOfTable[i].total_waitlisted;
            let status = "Open"
            if (enrolled >= cap && total_waitlisted < wait_cap) {
                status = "Waitlist"
            } else if (enrolled >= cap && total_waitlisted >= wait_cap) {
                status = "Closed"
            }
            CourseArray.push({
                courseid: rowsOfTable[i].course_id,
                deptid: rowsOfTable[i].dept_id,
                coursenumber: rowsOfTable[i].course_number,
                coursename: rowsOfTable[i].course_name,
                facultyname: rowsOfTable[i].user_name,
                room: rowsOfTable[i].course_room,
                status: status
            })
        }
        // console.log(rowsOfTable[0]);
        res.send({courses:CourseArray});
    });
}
exports.getEnrollmentData  = async function(req,res) {
    mysqlconnection.query('SELECT A.*, B.status FROM course AS A LEFT JOIN enrollment AS B ON A.course_id = B.course_id AND B.student_id = ?  WHERE A.course_id = ?;',[req.session.userid, req.query.courseid], (err, rowsOfTable, fieldsOfTable) => {
        if(err){
            console.log(err);
            res.send({courseEnrollment:[]})
        } 
        //console.log(rowsOfTable);
        for(i=0; i < rowsOfTable.length; i++) {
        var courseEnrollmentArray = [];
        let courseStatus = "";
        const courseStatusCalc = rowsOfTable[0].capacity - rowsOfTable[0].total_enrolled;
        if(courseStatusCalc > 0){
            courseStatus = "open"
        }else if(courseStatusCalc <= 0 && rowsOfTable[0].waitlist_capacity > rowsOfTable[0].total_waitlisted){
            courseStatus = "waitlist"
        }else if(courseStatusCalc <= 0 && rowsOfTable[0].waitlist_capacity == rowsOfTable[0].total_waitlisted){
            courseStatus = "closed"
        }
        let studentStatus = "NEW";
        if(rowsOfTable[0].status != null) {
            studentStatus = rowsOfTable[0].status;
        }
        courseEnrollmentArray.push({course_id: rowsOfTable[0].course_id, course_number: rowsOfTable[0].course_number,course_name:rowsOfTable[0].course_name,capacity:rowsOfTable[0].capacity,total_enrolled:rowsOfTable[0].total_enrolled,total_waitlisted:rowsOfTable[0].total_waitlisted, courseStatus: courseStatus, studentStatus: studentStatus});
        }
        // console.log(courseEnrollmentArray);
        res.send({courseEnrollment:courseEnrollmentArray});
    });
}
exports.createQuiz = async function(req,res) {
    
    const quiz_name = req.body.quiz_name
    const courseid   =req.body.course_id
    const quiz_inst = req.body.quiz_instructions
    const questions = req.body.questions
    const numQuestions = questions.length
    const points = questions.map((a) => {
        const point = Number(a.points)
        if(point<0)
        return 0
        else
        return point
    })
    const totalPoints = points.reduce((a,b)=>{
        return a+b
    })
    
    //create a quiz, then get quiz id & then create questions.
    const insertQuizQuery = "INSERT INTO quiz(quiz_name, instructions, course_id, num_questions, total_points) VALUES(?,?,?,?,?)"
    const getQuizId = "SELECT LAST_INSERT_ID() as quiz_id"
    const insertQuestions = "INSERT INTO quiz_question(quiz_id, question, points, correct_answer, option2, option3, option4) VALUES(?,?,?,?,?,?,?);"
    mysqlconnection.query(insertQuizQuery,[quiz_name, quiz_inst, courseid, numQuestions, totalPoints],(err, response)=>{
        if(err) {
            console.log(err);
            res.send({success:false})
        } else {
            mysqlconnection.query(getQuizId, (err, rowsOfTable)=>{
                if(err || rowsOfTable.length!=1) {
                    console.log(err);
                    console.log(rowsOfTable);
                    res.send({success:false})
                } else {
                    const quizid = rowsOfTable[0].quiz_id;
                    console.log("quizid "+ quizid)
                    for(i=0;i<questions.length;i++) {
                        let local_points = 0
                        if (questions[i].points>0){
                            local_points = questions[i].points
                        }
                        mysqlconnection.query(insertQuestions,[quizid,questions[i].question,local_points,questions[i].correct_option,questions[i].option2,questions[i].option3,questions[i].option4],(err, response)=>{
                            if(err){
                                console.log(err);
                            }
                        })
                    }
                    res.send({success:true})
                }
            })
        }
    })
}
exports.addCourseEnrolled  = async function(req,res) {
    mysqlconnection.query('INSERT INTO enrollment(course_id, student_id, status) VALUES(?,?,?) ON DUPLICATE KEY UPDATE status="ENROLL"',[req.body.course_id,req.session.userid, "ENROLL"], (err, result) => {
        if(err){
            console.log(err);
            res.send({addCourseEnrollment:false})
        } 
    });
    mysqlconnection.query('UPDATE course SET total_enrolled = total_enrolled + 1 WHERE course_id = ?',[req.body.course_id], (err, result) => {
        if(err){
            console.log(err);
            res.send({addCourseEnrollment:false})
        } 
        res.send({addCourseEnrollment:true});
    });
}

exports.addCourseWithPermission  = async function(req,res) {
    const permNumber = req.body.permissionNumber;
    mysqlconnection.query('UPDATE permission set is_used=1 where permission_id=? and course_id=?',[permNumber,req.body.course_id], (err, result)=>{
        if(err){
            console.log(err);
            res.send({addCourseEnrollment:false})
        }
        if (result.affectedRows == 1) {
            mysqlconnection.query('INSERT INTO enrollment(course_id, student_id, status) VALUES(?,?,?) ON DUPLICATE KEY UPDATE status="ENROLL"',[req.body.course_id,req.session.userid, "ENROLL"], (err, result) => {
                if(err){
                    console.log(err);
                    res.send({addCourseEnrollment:false})
                } 
            });
            mysqlconnection.query('UPDATE course SET total_enrolled = total_enrolled + 1 WHERE course_id = ?',[req.body.course_id], (err, result) => {
                if(err){
                    console.log(err);
                    res.send({addCourseEnrollment:false})
                } 
                res.send({addCourseEnrollment:true});
            });
        } else {
            res.send({addCourseEnrollment:false})
        }
    });
}
exports.dropCourseEnrolled  = async function(req,res) {
    mysqlconnection.query('DELETE from enrollment WHERE course_id = ? AND student_id = ?',[req.query.courseid, req.session.userid], (err, result) => {
        if(err){
            console.log(err);
            res.send({dropCourseEnrollment:false})
        } else {
            mysqlconnection.query('UPDATE course SET total_enrolled = total_enrolled - 1 WHERE course_id = ?',[req.query.courseid], (err, result) => {
                if(err){
                    console.log(err);
                    res.send({dropCourseEnrollment:false})
                } else {
                    mysqlconnection.query('SELECT enrollment_id from enrollment where course_id=? AND status=? ORDER BY enrollment_id ASC LIMIT 1',[req.query.courseid, "WAITLIST"],(err, rowsOfTable)=>{
                        if(err){
                            console.log(err);
                            res.send({dropCourseEnrollment:false})
                        } else {
                        if(rowsOfTable.length == 1){
                            mysqlconnection.query('UPDATE enrollment SET status="ENROLL" where enrollment_id=?;',[rowsOfTable[0].enrollment_id],(err, rowsOfTable)=>{
                                if(err){
                                    console.log(err);
                                }
                            });
                            mysqlconnection.query('UPDATE course SET total_enrolled = total_enrolled + 1, total_waitlisted=total_waitlisted-1 WHERE course_id = ?',[req.query.courseid], (err, result) => {
                                if(err){
                                    console.log(err);
                                } 
                            });
                        }
                        res.send({dropCourseEnrollment:true});
                        }
                    });
                }
            });
        }
    });
}
exports.waitlistCourse  = async function(req,res) {
    mysqlconnection.query('INSERT INTO enrollment(course_id, student_id, status) VALUES(?,?,?) ON DUPLICATE KEY UPDATE status="WAITLIST"',[req.body.course_id, req.session.userid, "WAITLIST"], (err, result) => {
        if(err){
            console.log(err);
            res.send({waitlistCourse:false})
        } 
    });
    mysqlconnection.query('UPDATE course SET total_waitlisted = total_waitlisted + 1 WHERE course_id = ?',[req.body.course_id], (err, result) => {
        if(err){
            console.log(err);
            res.send({waitlistCourse:false})
        } 
        res.send({waitlistCourse:true});
    });
}

exports.updateProfile = async function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const aboutme = req.body.aboutme;
    const city = req.body.city;
    const country = req.body.country;
    const company = req.body.company;
    const school = req.body.school;
    const hometown = req.body.hometown;
    const languages = req.body.languages;
    const gender = req.body.gender;
    const userid = req.session.userid;
    const query = 'UPDATE users SET user_name=?, user_email=?, phonenumber=?, about_me=?, city=?, country=?, company=?, school=?, hometown=?, languages=?, gender=? where user_id=?'
    mysqlconnection.query(query,[name,email,phonenumber,aboutme,city,country,company,school,hometown,languages,gender,userid],(err,response)=>{
        if(err){
            console.log(err);
            res.send({success:false})
        }else{
            res.send({success:true})
        }
    });
}

exports.deleteStudentFromCourse = async function(req, res) {
    const courseid=req.params.courseid;
    const studentid = req.params.studentid;
    const query = "DELETE from enrollment where student_id=? AND course_id=?"
    mysqlconnection.query(query,[studentid, courseid],(err, response)=>{
        if(err){
            console.log(err)
            res.send({success:false})
        } else {
            mysqlconnection.query('UPDATE course SET total_enrolled=total_enrolled-1 WHERE course_id=?',[courseid],(err, response)=>{
                if(err){
                    console.log(err)
                    res.send({success:false})
                } else {
                    res.send({success:true})
                }
            });
        } 
    })
}
exports.addAnnouncements = async function(req,res){
    const title = req.body.title;
    const content = req.body.content;
    const courseid = req.params.courseid;
    const query = "INSERT INTO announcements(courseid,title,content) VALUES(?,?,?)"
    mysqlconnection.query(query,[courseid,title,content],(err,response)=>{
        if(err){
            console.log(err)
            res.send({success:false})
        } else {
            res.send({success:true})
        }
    })
}
exports.getAnnouncement = async function(announceid,res){
    const query="SELECT user_name, faculty_id, title, content, DATE_FORMAT(timestamp,'%b %d, %Y at %h:%i %p') as timestamp from announcements A, course C, users U WHERE A.courseid=C.course_id AND A.announcementid=? AND C.faculty_id=U.user_id;"
    mysqlconnection.query(query,[announceid],(err,rowsOfTable)=>{
        if(err || rowsOfTable.length!=1){
            console.log(err);
            res.send({})
        } else {
            res.send({
                userid:rowsOfTable[0].faculty_id,
                username:rowsOfTable[0].user_name,
                title:rowsOfTable[0].title,
                content:rowsOfTable[0].content,
                timestamp:rowsOfTable[0].timestamp,
            })
        }
    })
}
exports.getAnnouncements = async function(courseid,res){
    const query="SELECT announcementid, faculty_id, title, content, DATE_FORMAT(timestamp,'%b %d, %Y at %h:%i %p') as timestamp from announcements A, course C WHERE A.courseid=C.course_id AND A.courseid=? ORDER BY announcementid DESC;"
    mysqlconnection.query(query,[courseid],(err, rowsOfTable)=>{
        if(err){
            console.log(err)
            res.send({announcements:[]})
        } else {
            let announceArray=[];
            for(i=0;i<rowsOfTable.length;i++) {
                announceArray.push({
                    id:rowsOfTable[i].announcementid,
                    userid:rowsOfTable[i].faculty_id,
                    title:rowsOfTable[i].title,
                    content:rowsOfTable[i].content,
                    timestamp:rowsOfTable[i].timestamp
                })
            }
            res.send({announcements:announceArray})
        }
    })
}
exports.getCoursePeople = async function(req, res) {
    const courseid=req.params.courseid;
    const query = "SELECT U.user_id, U.user_name, U.role from enrollment E, users U WHERE E.student_id=U.user_id AND E.course_id=? UNION SELECT U.user_id, U.user_name, U.role from course C, users U WHERE C.faculty_id=U.user_id AND C.course_id=?"
    mysqlconnection.query(query,[courseid, courseid],(err, rowsOfTable)=>{
        if(err){
            console.log(err)
            res.send({people:[]})
        } else {
            let peopleArray=[];
            for(i=0;i<rowsOfTable.length;i++) {
                peopleArray.push({
                    id:rowsOfTable[i].user_id,
                    name:rowsOfTable[i].user_name,
                    role:rowsOfTable[i].role,
                })
            }
            res.send({people:peopleArray})
        }
    })
}
exports.getRawImage = async function(userid, res) {
    const query='SELECT previewimage from user_image where user_id=?'
    mysqlconnection.query(query,[userid],(err,rowsOfTable)=>{
        if(err){
            console.log(err);
            const image = Buffer.from(userimage.defaultUserImage, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': image.length
              });
            res.end(image)
        }else if(rowsOfTable.length ==1){
            console.log("userid "+userid)
            var base64Data = rowsOfTable[0].previewimage.replace(/^data:image\/png;base64,/, '');
            const image = Buffer.from(base64Data, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': image.length
              });
            res.end(image)
        } else{
            const image = Buffer.from(userimage.defaultUserImage, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': image.length
              });
            res.end(image)
        }
    });
}
exports.getProfileImage = async function(userid, res) {
    const query='SELECT previewimage from user_image where user_id=?'
    mysqlconnection.query(query,[userid],(err,rowsOfTable)=>{
        if(err){
            console.log(err);
            res.send({success:false})
        }else if(rowsOfTable.length ==1){
            res.send({success:true, image:rowsOfTable[0].previewimage})
        } else{
            res.send({success:false})
        }
    });
}
exports.updateImage = async function(req, res) {
    const imageData = req.body.image;
    const userid = req.session.userid;
    const query = 'INSERT INTO user_image VALUES(?,?) ON DUPLICATE KEY UPDATE previewimage=?'
    mysqlconnection.query(query,[userid, imageData, imageData],(err,response)=>{
        if(err){
            console.log(err);
            res.send({success:false})
        }else{
            res.send({success:true})
        }
    });
}
exports.addCourse = async function(req, res) {
    const dupQuery = "SELECT course_id from course where course_number=? AND term_id=? AND dept_id=?";
    const query = 'INSERT INTO course(dept_id,course_number,term_id,course_name,capacity,waitlist_capacity,faculty_id,course_room,course_desc) VALUES (?,?,?,?,?,?,?,?,?)';
    try{
        mysqlconnection.query(dupQuery,[
            req.body.courseid,
            req.body.term,
            req.body.department
        ],(err,rowsOfTable)=>{
            if(err){
                console.log(err);
                res.send({success:false})
            }
            if(rowsOfTable.length==0) {
                mysqlconnection.query(query,[
                    req.body.department,
                    req.body.courseid,
                    req.body.term,
                    req.body.coursename,
                    req.body.coursecapacity,
                    req.body.waitcapacity,
                    req.session.userid,
                    req.body.courseroom,
                    req.body.coursedesc
                ], (err, result) => {
                    if(err){
                        console.log(err);
                        res.send({success:false})
                    }
                    res.send({success:true})
                });
            } else {
                res.send({success:false})
            }
        })
    } catch(e) {
        res.send({success:false})
    }
}
exports.generatePermissions  = async function(req,res) {
    const courseid = req.params.courseid
    const faculty_id = req.session.userid
    const num_to_generate = req.body.number
    let values = ""
    const endValues = "',"+courseid+",0,"+faculty_id+"),"
    const permNumbers = [];
    for(i=0;i<num_to_generate;i++) {
        permNumbers.push(uuidv4());
    }
    for(i=0;i<permNumbers.length;i++) {
        const permNumber = permNumbers[i];
        values += "('" + permNumber +endValues
    }
    values = values.substring(0, values.length-1);
    const query = 'INSERT INTO permission VALUES '+values;
    //console.log(query)
    mysqlconnection.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.send({permissions:[]})
        } else{
            res.send({permissions:permNumbers})
        }
    });
}
exports.getAssignDetails = async function(assignid, res) {
    const query = "SELECT title, points from assignment where assignment_id=?"
    mysqlconnection.query(query,[assignid],(err, rowsOfTable)=>{
        if(err || rowsOfTable.length !=1){
            console.log(err)
            res.send({})
        } else {
            res.send({name:rowsOfTable[0].title, points:rowsOfTable[0].points})
        }
    })
}
exports.getSubmissions = async function(courseid,assignmentid, studentid, res) {
    const query = "SELECT submission_id,user_filename, DATE_FORMAT(timestamp,'%b %d at %h:%i %p') as timestamp from assignment_submission S, assignment A WHERE A.assignment_id=S.assignment_id AND S.student_id=? AND S.assignment_id=? AND A.course_id=?;"
    mysqlconnection.query(query,[studentid, assignmentid,courseid],(err,rowsOfTable)=>{
        if(err){
            console.log(err)
            res.send({submissions:[]})
        } else {
            let subArray = [];
            for (i=0;i<rowsOfTable.length;i++){
                subArray.push(
                    {
                        timestamp:rowsOfTable[i].timestamp,
                        userfilename:rowsOfTable[i].user_filename,
                        submission_id:rowsOfTable[i].submission_id
                    })
            }
            res.send({submissions:subArray})
        }});
}
exports.getAllSubmissions = async function(assignmentid, res){
    const query = "SELECT S.student_id,S.submission_id,user_name,user_filename,`timestamp`,grade FROM assignment_submission S, (SELECT student_id,MAX(submission_id) as submission_id from assignment_submission WHERE assignment_id=? GROUP BY student_id) AS A, users U WHERE A.submission_id=S.submission_id AND U.user_id=S.student_id;"
    mysqlconnection.query(query,[assignmentid],(err, rowsOfTable)=>{
        if(err){
            console.log(err)
            res.send({submissions:[]})
        } else {
            let subArray = [];
            for (i=0;i<rowsOfTable.length;i++){
                subArray.push(
                    {
                        student_id:rowsOfTable[i].student_id,
                        submission_id:rowsOfTable[i].submission_id,
                        user_name:rowsOfTable[i].user_name,
                        user_filename:rowsOfTable[i].user_filename,
                        timestamp:rowsOfTable[i].timestamp,
                        grade:rowsOfTable[i].grade
                    })
            }
            res.send({submissions:subArray})
        }
    })
}
exports.updateGrade = async function(req,res){
    const query = "UPDATE assignment_submission SET isgraded=1, grade=? WHERE submission_id=?"
    mysqlconnection.query(query,[req.body.grade, req.body.submissionid],(err, response)=>{
        if(err ){
            res.send({success:false})
        } else {
            res.send({success:true})
        }
    })
}
exports.getFile = async function(fileid,res){
    let query = "SELECT localfilename,filename from course_files where fileid=?;"
    mysqlconnection.query(query,[fileid],(err,rowsOfTable)=>{
        if(err || rowsOfTable.length!=1) {
            console.log(err)
            res.send(404);
        } else {
            const localfilename = rowsOfTable[0].localfilename
            const userfilename = rowsOfTable[0].filename
            var file = fs.createReadStream('./uploads/'+localfilename);
        var stat = fs.statSync('./uploads/'+localfilename);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename='+userfilename);
        file.pipe(res);
        }
    });
}

exports.getSubmissionFile = async function(req,submissionid,res){
    let query = "SELECT localfilename,user_filename from assignment_submission where student_id=? AND submission_id=?;"
    let params = [req.session.userid,submissionid]
    if(!req.session.isStudent) {
        query = "SELECT localfilename,user_filename from assignment_submission where submission_id=?;"
        params = [submissionid]
    }
    mysqlconnection.query(query,params,(err,rowsOfTable)=>{
        if(err || rowsOfTable.length!=1) {
            console.log(err)
            res.send(404);
        } else {
            const localfilename = rowsOfTable[0].localfilename
            const userfilename = rowsOfTable[0].user_filename
            var file = fs.createReadStream('./uploads/'+localfilename);
        var stat = fs.statSync('./uploads/'+localfilename);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename='+userfilename);
        file.pipe(res);
        }
    });
}
exports.uploadFile = async function(courseid, localfilename, userfilename, humanSize, res){
    const query = "INSERT INTO course_files(course_id,localfilename,filename,size) VALUES(?,?,?,?)"
    mysqlconnection.query(query,[courseid,localfilename,userfilename,humanSize], (err, response)=>{
        if(err){
            console.log(err)
            res.send({success:false})
        } else {
            res.send({success:true})
        }
    })
}
exports.submitAssignment = async function(studentid, assignmentid, localfilename, userfilename, res) {
    const query = "INSERT INTO assignment_submission(assignment_id,student_id,localfilename,user_filename) VALUES(?,?,?,?);"
    mysqlconnection.query(query,[assignmentid, studentid, localfilename, userfilename],(err,response)=>{
        if(err){
            console.log(err)
            res.send({success:false})
        } else {
            res.send({success:true})
        }
    })
}
exports.getFiles = async function(req, res){
    const courseid = req.params.courseid;
    const query ="SELECT fileid,filename,DATE_FORMAT(uploaded_timestamp,'%b %d, %Y') as uploaded_timestamp,size,user_name from course_files C, course CC, users U  WHERE C.course_id=? AND C.course_id=CC.course_id AND CC.faculty_id=U.user_id;"
    mysqlconnection.query(query,[courseid],(err, rowsOfTable)=>{
        if(err){
            console.log(err);
            res.send({files:[]})
        } else {
            let fileArray = [];
            for (i=0;i<rowsOfTable.length;i++){
                fileArray.push(
                    {
                        fileid:rowsOfTable[i].fileid,
                        filename:rowsOfTable[i].filename,
                        uploaded_timestamp:rowsOfTable[i].uploaded_timestamp,
                        size:rowsOfTable[i].size,
                        user_name:rowsOfTable[i].user_name
                    })
            }
            res.send({files:fileArray})
        }
    })
}
exports.getAssignments = async function(req,res) {
    const courseid = req.params.courseid;
    const query = "SELECT assignment_id, title, points from assignment WHERE course_id=?";
    mysqlconnection.query(query,[courseid],(err, rowsOfTable)=>{
        if(err){
            console.log(err);
            res.send({assignments:[]})
        } else {
            let assignArray = [];
            for (i=0;i<rowsOfTable.length;i++){
                assignArray.push(
                    {
                        id:rowsOfTable[i].assignment_id,
                        name:rowsOfTable[i].title,
                        points:rowsOfTable[i].points
                    })
            }
            res.send({assignments:assignArray})
        }
    })
}
exports.addAssignment = async function(req, res){
    const query = "INSERT INTO assignment(course_id,title,points) VALUES(?,?,?)"
    const courseid = req.params.courseid;
    mysqlconnection.query(query,[courseid,req.body.title,req.body.points],(err,response)=>{
        if(err){
            console.log(err);
            res.send({success:false})
        } else {
            res.send({success:true})
        }
    });
}
exports.getGrades = async function(req, res){
    const courseid = req.params.courseid;
    const userid = req.session.userid;
    const query = "SELECT A.title as name, A.assignment_id as id, S.grade as score, S.isgraded as graded, A.points as outof, 'Assignment' as type FROM assignment A, assignment_submission S, (SELECT MAX(submission_id) as msid from assignment_submission WHERE student_id=? group by assignment_id) as MAS WHERE A.assignment_id=S.assignment_id AND S.submission_id=MAS.msid AND A.course_id=? UNION SELECT quiz_name as name, Q.quiz_id as id, score as score, 1 as graded, total_points as outof, 'Quiz' as type FROM quiz Q, quiz_answers QA WHERE Q.course_id=? AND QA.student_id=? AND Q.quiz_id=QA.quiz_id;"
    const params = [userid, courseid, courseid, userid]
    mysqlconnection.query(query, params, (err, rowsOfTable)=>{
        if(err){
            console.log(err);
            res.send({grades:[],maxTotal:0,totalScore:0})
        } else {
            let maxTotal=0
            let totalScore=0
            let gradeArray = [];
            for (i=0;i<rowsOfTable.length;i++){
                let score = "NA"
                if(rowsOfTable[i].graded == 1) {
                    score = rowsOfTable[i].score
                    totalScore += score
                    maxTotal += rowsOfTable[i].outof
                }
                gradeArray.push(
                    {
                        name:rowsOfTable[i].name,
                        id:rowsOfTable[i].id,
                        score:score,
                        outof:rowsOfTable[i].outof,
                        type:rowsOfTable[i].type
                    }
                )
            }
            res.send({grades:gradeArray,maxTotal:maxTotal,totalScore:totalScore})
        }
    })
}

exports.getQuizzes = async function(req, res) {
    const courseid = req.params.courseid;
    const query = "SELECT * from quiz where course_id=?"
    mysqlconnection.query(query,[courseid], (err, rowsOfTable)=>{
        if(err){
            console.log(err);
            res.send({quizzes:[]})
        } else {
            let quizArray = [];
            for (i=0;i<rowsOfTable.length;i++){
                quizArray.push(
                    {
                        quiz_name:rowsOfTable[i].quiz_name,
                        quiz_id:rowsOfTable[i].quiz_id,
                        instructions:rowsOfTable[i].instructions,
                        num_questions:rowsOfTable[i].num_questions,
                        total_points:rowsOfTable[i].total_points
                    }
                )
            }
            res.send({quizzes:quizArray})
        }
    })
}
exports.getQuiz = async function(req, res) {
    const quizid = req.params.quizid
    mysqlconnection.query('SELECT * FROM quiz where quiz_id=?',[quizid],(err, rowsOfTable)=> {
        if(err || rowsOfTable.length!=1){
            console.log(err);
            res.send({quiz:null})
        }else {
            res.send({quiz:{
                quiz_name:rowsOfTable[0].quiz_name,
                instructions:rowsOfTable[0].instructions,
                total_points:rowsOfTable[0].total_points,
                num_questions:rowsOfTable[0].num_questions
            }})
        }
    });
}
exports.getQuestions = async function(req, res) {
    //validate that the user is enrolled in the course.
    const quizid = req.params.quizid
    const userid = req.session.userid
    const query = "SELECT question_id, question, points, correct_answer, option2, option3, option4 FROM quiz_question QQ, quiz Q, enrollment E WHERE QQ.quiz_id=Q.quiz_id AND Q.course_id=E.course_id AND E.student_id=? AND E.status='ENROLL' AND QQ.quiz_id=?"
    mysqlconnection.query(query,[userid, quizid],(err, rowsOfTable)=>{
        if(err)
        res.send({questions:[]})
        else {
            let questionArray = []
            for(i=0;i<rowsOfTable.length;i++){
                let optionsArray = [rowsOfTable[i].correct_answer,
                rowsOfTable[i].option2,rowsOfTable[i].option3,rowsOfTable[i].option4]
                for(j=4; j>0;j--) {
                    const index = Math.floor(Math.random() * j);
                    const temp = optionsArray[j-1];
                    optionsArray[j-1] = optionsArray[index]
                    optionsArray[index]  =temp;
                }
                questionArray.push(
                    {
                    question_id:rowsOfTable[i].question_id,
                    question:rowsOfTable[i].question,
                    option1:optionsArray[0],
                    option2:optionsArray[1],
                    option3:optionsArray[2],
                    option4:optionsArray[3],
                    points:rowsOfTable[i].points
                    }
                )
            } 
            res.send({questions:questionArray})
        }
    })
}
exports.submitAnswers = async function(req, res) {
    // submitting quiz answers.
    const quizid = req.params.quizid
    const userid = req.session.userid
    // get alist of question_ids, validate answers 
    // and then insert all data.
    const query = "SELECT question_id, correct_answer, points from quiz_question where quiz_id=?"
    mysqlconnection.query(query,[quizid],(err, rowsOfTable)=>{
        if(err) {
            console.log(err)
            res.send({success:false})
        }else{
        let score = 0
        let answerJson = {}
        for(i=0;i<rowsOfTable.length;i++) {
            const given_ans = req.body[rowsOfTable[i].question_id]
            if(given_ans === rowsOfTable[i].correct_answer) {
                score += rowsOfTable[i].points
            }
            answerJson[rowsOfTable[i].question_id] = given_ans
        }
        mysqlconnection.query("INSERT into quiz_answers VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE answers=?, score=?",[quizid, userid, JSON.stringify(answerJson), score,JSON.stringify(answerJson), score],(err, response)=>{
            if(err) {
                console.log(err)
                res.send({success:false})
            }else {
                res.send({success:true, score:score})
            }
        })
        }
    })
}

exports.getCourses  = async function(req,res) {
    let query = 'SELECT C.dept_id, C.course_number, C.course_name, C.course_id, C.faculty_id, T.term_name FROM enrollment E, course C, term T WHERE C.course_id = E.course_id AND E.student_id = ? AND E.status = "ENROLL" AND C.term_id = T.term_id;'
    if (!req.session.isStudent) {
        query = 'SELECT C.dept_id, C.course_number, C.course_name, C.course_id, C.faculty_id, T.term_name FROM course C, term T WHERE C.faculty_id = ? AND C.term_id = T.term_id;'
    }
    mysqlconnection.query(query,[req.session.userid], (err, rowsOfTable) => {
        if(err){
            console.log(err);
            res.send({courseList:[]})
        } 
        let courseArray=[];
        for (i=0;i<rowsOfTable.length;i++){
            courseArray.push({
                course_id:rowsOfTable[i].course_id,
                dept_id:rowsOfTable[i].dept_id,
                course_number:rowsOfTable[i].course_number,
                course_name:rowsOfTable[i].course_name,
                term_name:rowsOfTable[i].term_name
            })
        }
        console.log("userid : "+req.session.userid)
        res.send({courseList:courseArray,isStudent:req.session.isStudent})
    });
}