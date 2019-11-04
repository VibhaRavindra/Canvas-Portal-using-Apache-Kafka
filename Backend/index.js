const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const multer = require('multer');
const FormData = multer({ dest: './uploads/' });
// const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const { body } = require('express-validator/check');
// var session = require('express-session')
var kafka = require('./kafka/client');
const userimage  =require('./defaultUserImage');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});
var requireFaculty = passport.authenticate('faculty', {session: false});

// app.use(cookieParser());
// app.use(session({secret: "BRahujBqkZDAHMtYKoPP"}));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./passport')(passport);
//define terms
var termArray = [
    {"value": "201902","term": "Summer 2019"},
    {"value": "201903","term": "Fall 2019"},
    {"value": "202001","term": "Spring 2020"}
]
//define department
var departmentArray = [
    {"value" : "AE", "departmentName" : "Aerospace Engineering"},
    {"value" : "CMPE", "departmentName" : "Computer Engineering"},
    {"value" : "EE", "departmentName" : "Electrical Engineering"},
    {"value" : "SE", "departmentName" : "Software Engineering"}
]
    
// app.get('/isLoggedIn', (req,res)=>{
//     if(req.session.IsLoggedIn){
//         res.send({
//             isLoggedIn: true,
//             IsInvalid: false,
//             isStudent:req.session.isStudent,
//             userid:req.session.userid
//         })
//     } else {
//         res.send({
//             IsInvalid: false,
//             isLoggedIn: false
//         })
//     }
// })

app.post('/getUser',[
    body('emailId').isEmail().normalizeEmail(),
    body('password').not().isEmpty().isLength({ min: 5 })
], FormData.none(), (req,res,next) => {
    let body = {email: req.body.emailId, password: req.body.password}
    kafka.make_request('signin', body, function(err,result){
        console.log('in result');
        console.log(result);
        if (err){
            res.send({
                IsInvalid: true,
                isLoggedIn: false,
                errMessage: "Sign In Failed"
            })
        }else{
            var token = {
                IsLoggedIn : result.isLoggedIn,
                isStudent:result.isStudent,
                userid:result.userid,
                user_name:result.user_name
            }
            var signed_token = jwt.sign(token, "BRahujBqkZDAHMtYKoPP", {
                expiresIn: 86400 // in seconds
            });
            result.token = signed_token
            // req.session.IsLoggedIn = result.isLoggedIn;
            // req.session.isStudent = result.isStudent;
            // req.session.userid =  result.userid;
            // req.session.user_name = result.user_name;
            res.send(result);
        }
    });
})

app.put('/addUser',[
    body('username').not().isEmpty().trim().escape(),
    body('emailId').not().isEmpty().isEmail().normalizeEmail(),
    body('password').not().isEmpty().isLength({ min: 5 }),
    body('employee').not().isEmpty().trim().escape()], FormData.none(), (req,res,next) => {

            let body = {email: req.body.emailId, password: req.body.password, username: req.body.username, employee: req.body.employee}
            kafka.make_request('signup', body, function(err,result){
                console.log('in result');
                console.log(result);
                if (err){
                    res.send({
                        isInvalid: true,
                        isLoggedIn: false,
                        errMessage: "Sign Up Failed"
                    })
                }else{
                    res.send(result);
                }
            });
    }
)

app.get('/getProfileData/:userid',requireAuth, FormData.none(),(req,res)=>{
        let body = {userid: req.params.userid}
        kafka.make_request('getProfileData', body, function(err,result){
            console.log(result);
            if (err){
                res.send({
                    isInvalid: true,
                    isLoggedIn: false,
                    errMessage: "Sign Up Failed"
                })
            }else{
                res.send(result);
            }
        });
})

//Courses: Get list of all courses
app.get('/getCourses/:role/:userid', requireAuth,(req, res, next) => {
        let body = {isStudent: req.params.role=="student", userid: req.params.userid}
        kafka.make_request('getCourses', body, function(err,result){
            console.log(result);
            if (err){
                res.send({courseList:[]})
            }else{
                res.send(result);
            }
        });
})
app.get('/getDepartment', requireAuth,(req, res, next) => {
        res.send({department: departmentArray})
})
app.get('/getTerms', requireAuth,(req, res, next) => {
        res.send({terms:termArray});
})

//Get course details to display in Home Page inside Course
app.get('/getCourseDetails/:courseid/:userid',requireAuth,(req,res)=>{
        let body = {
            courseid: req.params.courseid,
            userid: req.params.userid
        }
        kafka.make_request('getCourseDetails', body, function(err,result){
            if (err){
                res.send({})
            }else{
                res.send(result);
            }
        });
})
app.get("/getAnnouncements/:courseid",requireAuth,(req,res)=>{
        let body = {courseid: req.params.courseid}
        kafka.make_request('getAnnouncements', body, function(err,result){
            if (err){
                res.send({announcements:[]})
            }else{
                res.send(result);
            }
        });
})
app.get("/getAnnouncement/:announceid",requireAuth,(req,res)=>{
        let body = {announceid: req.params.announceid}
        kafka.make_request('getAnnouncement', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.post("/addAnnouncements/:courseid",requireFaculty,FormData.none(),(req,res)=>{
        let body = {courseid: req.params.courseid, title: req.body.title, content: req.body.content}
        kafka.make_request('addAnnouncements', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.put('/addAssignment/:courseid',requireFaculty,FormData.none(), (req, res) => {
        let body = {courseid: req.params.courseid, title: req.body.title, points: req.body.points}
        kafka.make_request('addAssignment', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.get('/getAssignments/:courseid',requireAuth,(req,res)=>{
        let body = {courseid: req.params.courseid}
        kafka.make_request('getAssignments', body, function(err,result){
            if (err){
                res.send({assignments:[]});
            }else{
                res.send(result);
            }
        });
})
app.get("/getAssignDetails/:assignid",requireAuth,(req,res)=>{
        let body = {assignid: req.params.assignid}
        kafka.make_request('getAssignDetails', body, function(err,result){
            if (err){
                res.send({})
            }else{
                res.send(result);
            }
        });
})
app.get('/getGrades/:courseid/:userid', requireAuth,(req, res, next) => {
        let body = {courseid: req.params.courseid, userid: req.params.userid}
        kafka.make_request('getGrades', body, function(err,result){
            if (err){
                res.send({grades:[],maxTotal:0,totalScore:0})
            }else{
                res.send(result);
            }
        });
})
app.post("/updateGrade",FormData.none(),requireFaculty,(req,res)=>{
        let body = {
            grade: req.body.grade, 
            studentid: req.body.studentid,
            assignid: req.body.assignid
        }
        kafka.make_request('updateGrade', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.get('/getQuizzes/:courseid',requireAuth,(req,res)=>{
        let body = {
            courseid: req.params.courseid
        }
        kafka.make_request('getQuizzes', body, function(err,result){
            if (err){
                res.send({quizzes:[]})
            }else{
                res.send(result);
            }
        });
})
app.get('/getQuiz/:quizid',requireAuth,(req,res)=>{
        let body = {
            quizid: req.params.quizid
        }
        kafka.make_request('getQuiz', body, function(err,result){
            if (err){
                res.send({quiz:{}})
            }else{
                res.send(result);
            }
        });
})
app.get('/getQuestions/:quizid/:userid',requireAuth,(req,res)=>{
        let body = {
            quizid: req.params.quizid,
            userid: req.params.userid
        }
        kafka.make_request('getQuestions', body, function(err,result){
            if (err){
                res.send({questions:[]})
            }else{
                res.send(result);
            }
        });
})

app.post('/submitAnswers/:quizid/:userid',requireAuth,(req,res)=>{
        let body = {
            quizid: req.params.quizid,
            userid: req.params.userid,
            answers: req.body.answers
        }
        kafka.make_request('submitAnswers', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.post("/createQuiz", requireFaculty,(req,res)=>{

        let points= req.body.questions.map((a) => {
            const point = Number(a.points)
            if(point<0)
            return 0
            else
            return point
        })
        let body = {
            quiz_name: req.body.quiz_name,
            courseid: req.body.course_id,
            quiz_inst: req.body.quiz_instructions,
            questions: req.body.questions,
            numQuestions: req.body.questions.length,
            totalPoints: points.reduce((a,b)=>{
                return a+b
            })
        }
        console.log(body);
        kafka.make_request('createQuiz', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
//----

app.get("/getSubmissions/:courseid/:assignmentid/:userid",requireAuth,FormData.none(),(req,res)=>{
        let body = {
            courseid: req.params.courseid,
            studentid: req.params.userid,
            assignmentid: req.params.assignmentid
        }
        kafka.make_request('getSubmissions', body, function(err,result){
            if (err){
                res.send({submissions:[]})
            }else{
                res.send(result);
            }
        });
})
app.get("/getAllSubmissions/:assignmentid",requireFaculty,FormData.none(),(req,res)=>{
        let body = {
            assignmentid: req.params.assignmentid
        }
        kafka.make_request('getAllSubmissions', body, function(err,result){
            if (err){
                res.send({submissions:[]})
            }else{
                res.send(result);
            }
        });
})
app.post("/submitAssignment/:assignmentId/:userid",requireAuth,FormData.single("submissionfile"),(req,res)=>{
        let body = {
            studentid: req.params.userid,
            assignmentid: req.params.assignmentId,
            localfilename: req.file.filename,
            userfilename:req.file.originalname.replace(/[^a-zA-Z0-9\.]/g,"_")
        }
        kafka.make_request('submitAssignment', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.put("/updateCourseOrder/:userid",requireAuth,(req, res)=>{
        let body = {
            userid: req.params.userid,
            order: req.body.order
        }
        kafka.make_request('updateCourseOrder', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.get('/getFiles/:courseid',requireAuth,(req,res)=>{
        let body = {
            courseid: req.params.courseid
        }
        kafka.make_request('getFiles', body, function(err,result){
            if (err){
                res.send({files:[]})
            }else{
                res.send(result);
            }
        });
})

app.get('/getRawImage/:userid',(req,res)=>{
    let body = {
        userid: req.params.userid
    }
    kafka.make_request('getProfileImage', body, function(err,result){
        if(result.success) {
            var base64Data = result.image.replace(/^data:image\/png;base64,/, '');
            const image = Buffer.from(base64Data, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': image.length
            });
            res.end(image)
        } else {
            // send default image to FE
            const image = Buffer.from(userimage.defaultUserImage, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': image.length
            });
            res.end(image)
        }
        // if (err){
        //     res.send({files:[]})
        // }else{
        //     res.send(result);
        // }
    });
    // const userid = req.params.userid
    // mysql.getRawImage(userid,res);
})
app.delete('/deleteStudentFromCourse/:studentid/:courseid',requireFaculty,(req,res)=>{
        let body = {
             course_id: req.params.courseid,
             userid: req.params.studentid
        }
        kafka.make_request('dropCourseEnrolled', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.get('/getCoursePeople/:courseid',requireAuth,(req,res)=>{
        let body = {
            courseid: req.params.courseid,
            role: "all"
        }
        kafka.make_request('getCoursePeople', body, function(err,result){
            if (err){
                res.send({people:[]})
            }else{
                res.send(result)
            }
        });
})
app.get('/getCoursePeople/:courseid/:role/:user_name',requireAuth,(req,res)=>{
        let body = {
            courseid: req.params.courseid,
            role: req.params.role
        }
        kafka.make_request('getCoursePeople', body, function(err,result){
            if (err){
                res.send({result:{people:[], current_name:req.params.user_name}})
            }else{
                res.send({result:result, current_name:req.params.user_name});
            }
        });
})
app.post('/updateImage/:userid', requireAuth,FormData.none(),(req,res)=>{
        let body = {
            userid: req.params.userid,
            imageData: req.body.image
        }
        kafka.make_request('updateImage', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.post('/updateProfile/:userid',requireAuth, FormData.none(),(req,res)=>{
        let body = {
            name: req.body.name,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            aboutme: req.body.aboutme,
            city: req.body.city,
            country: req.body.country,
            company: req.body.company,
            school: req.body.school,
            hometown: req.body.hometown,
            languages: req.body.languages,
            gender: req.body.gender,
            userid: req.params.userid
        }
        kafka.make_request('updateProfile', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.get('/getProfileImage/:userid',requireAuth, FormData.none(),(req,res)=>{
        let body = {
            userid: req.params.userid
        }
        kafka.make_request('getProfileImage', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})

app.post('/addCourse/:userid',[
    body('courseid').not().isEmpty().trim().escape().isNumeric(),
    body('coursename').not().isEmpty().trim().escape(),
    body('department').not().isEmpty().trim().escape(),
    body('term').not().isEmpty().trim().escape(),
    body('coursedesc').not().isEmpty().trim().escape(),
    body('courseroom').not().isEmpty().trim().escape(),
    body('coursecapacity').not().isEmpty().trim().escape().isNumeric(),
    body('waitcapacity').not().isEmpty().trim().escape().isNumeric()
],requireFaculty,FormData.none(),(req,res)=>{
   
        let body = {
            userid: req.params.userid,
            courseid: req.body.courseid,
            coursename: req.body.coursename,
            term:  req.body.term,
            department: req.body.department,
            coursecapacity: req.body.coursecapacity,
            waitcapacity: req.body.waitcapacity,
            courseroom: req.body.courseroom,
            coursedesc: req.body.coursedesc
        }
        console.log("TERM IS :"+req.body.term)
        kafka.make_request('addCourse', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.post('/searchCourses', [
    body('term').not().isEmpty().trim().escape(),
    body('department').not().isEmpty().trim().escape(),
    body('condition').trim().escape(),
    body('courseNumber').trim().escape(),
    body('courseName').trim().escape()
    ], requireAuth,FormData.none(), (req,res)=>{

            let body = {
                term:  req.body.term,
                dept: req.body.department,
                condition: req.body.condition,
                courseNumber: req.body.courseNumber,
                courseName: req.body.courseName
            }
            kafka.make_request('searchCourses', body, function(err,result){
                if (err){
                    res.send({courses:[]})
                }else{
                    res.send(result);
                }
            });
})
app.get('/getEnrollmentData/:userid',requireAuth, (req,res) => {
    // console.log("req.query.courseid"+req.query.courseid);

        let body = {
            userid:  req.params.userid,
            courseid: req.query.courseid
        }
        kafka.make_request('getEnrollmentData', body, function(err,result){
            if (err){
                res.send({courseEnrollment:[]})
            }else{
                res.send(result);
            }
        });
})
app.post('/addCourseEnrolled/:userid', requireAuth,(req,res) => {
        let body = {
            userid:  req.params.userid,
            course_id: req.body.course_id
        }
        kafka.make_request('addCourseEnrolled', body, function(err,result){
            if (err){
                res.send({addCourseEnrollment:[]})
            }else{
                res.send(result);
            }
        });
})
app.delete('/dropCourseEnrolled/:userid',requireAuth, (req,res) => {
        let body = {
            userid:  req.params.userid,
            course_id: req.query.courseid
        }
        kafka.make_request('dropCourseEnrolled', body, function(err,result){
            if (err){
                res.send({dropCourseEnrollment:[]})
            }else{
                res.send(result);
            }
        });
})
app.put('/waitlistCourse/:userid',requireAuth, (req,res) => {
        let body = {
            userid:  req.params.userid,
            course_id: req.body.course_id
        }
        kafka.make_request('waitlistCourse', body, function(err,result){
            if (err){
                res.send({waitlistCourse:[]})
            }else{
                res.send(result);
            }
        });
})
app.post('/generatePermissions/:courseid/:userid',[
    body('number').not().isEmpty().trim().escape().isNumeric()], 
    requireFaculty,FormData.none(),(req,res)=>{
        let body = {
            faculty_id:  req.params.userid,
            courseid: req.params.courseid,
            num_to_generate: req.body.number
        }
        kafka.make_request('generatePermissions', body, function(err,result){
            if (err){
                res.send({permissions:[]})
            }else{
                res.send(result);
            }
        });
})
app.post('/addCourseWithPermission/:userid', requireAuth,FormData.none(), (req,res) => {
        let body = {
            userid:  req.params.userid,
            course_id: req.body.course_id,
            permNumber: req.body.permissionNumber
        }
        kafka.make_request('addCourseWithPermission', body, function(err,result){
            if (err){
                res.send({addCourseEnrollment:[]})
            }else{
                res.send(result);
            }
        });
})
app.get("/getMessages/:messageType/:userid",requireAuth,(req,res)=>{
        let body = {
            userid: req.params.userid,
            messageType: req.params.messageType
        }
        kafka.make_request('getMessages', body, function(err,result){
            if (err){
                res.send({messages:[]})
            }else{
                res.send(result);
            }
        });
})
app.post('/sendMessages/:userid',requireAuth, FormData.none(), (req,res) => {
        let body = {
            from: req.params.userid,
            to: req.body.messageTo,
            subject: req.body.subject,
            message: req.body.body,
            course: req.body.course,
            course_name: req.body.course_name,
            from_name: req.body.from_name,
            to_name: req.body.to_name
        }
        kafka.make_request('sendMessages', body, function(err,result){
            if (err){
                console.log(err)
                res.send({success:false})
            }else{
                res.send(result)
            }
        });
})


app.post("/uploadFile/:courseid",requireFaculty,FormData.single("file"),(req,res)=>{
        const size = req.file.size
        var powerindex = Math.floor( Math.log(size) / Math.log(1024))
        var humanSize =( size / Math.pow(1024, powerindex) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][powerindex];
        let body = {
            courseid:  req.params.courseid,
            localfilename: req.file.filename,
            userfilename: req.file.originalname.replace(/[^a-zA-Z0-9\.]/g,"_"),
            humanSize: humanSize,
            createdby: req.session.user_name
        }
        kafka.make_request('uploadFile', body, function(err,result){
            if (err){
                res.send({success:false})
            }else{
                res.send(result);
            }
        });
})
app.get("/getGradingFile/:fileid", requireAuth,FormData.none(),(req,res)=>{
    let body = {
        fileid: req.params.fileid
    }
    var bits = fs.readFileSync("./uploads/"+req.params.fileid)
        var base64String = new Buffer(bits).toString('base64');
        res.send({pdf: "data:application/pdf;base64," +base64String})
})
app.get("/getFile/:fileid", requireAuth,FormData.none(),(req,res)=>{
        let body = {
            fileid: req.params.fileid
        }
        kafka.make_request('getFile', body, function(err,result){
            console.log(err)
            if (err!=null || result == null){
                res.send(404)
            }else{
            var bits = fs.readFileSync("./uploads/"+result.localfilename)
            var base64String = new Buffer(bits).toString('base64');
            res.send({pdf: "data:application/pdf;base64," +base64String})
            }
        });
})
app.get("/getRawPDF/:fileid",FormData.none(),(req,res)=>{
    var bits = fs.readFileSync("./uploads/"+req.params.fileid);
    var base64String = new Buffer(bits).toString('base64');
    res.send({
        pdf: "data:application/pdf;base64," +base64String
    })
})

// ----------------------------------------------------

app.get("/getSubmissionFile/:submissionid/:userid",requireAuth,FormData.none(),(req,res)=>{

        let body = {
            submissionid: req.params.submissionid,
            userid: req.params.userid
        }
        kafka.make_request('getSubmissionFile', body, function(err,result){
            if (err || result==null){
                res.send(404)
            }else{
            var bits = fs.readFileSync("./uploads/"+result.localfilename)
            var base64String = new Buffer(bits).toString('base64');
            res.send({pdf: "data:application/pdf;base64," +base64String})
            }
        });
})

app.get('/logout',(req, res, next) => {
    req.session.destroy();
    res.send({isLoggedIn: false})
})

var nodejs_server = app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = nodejs_server