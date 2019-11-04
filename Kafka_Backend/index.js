var connection =  new require('./kafka/Connection');
//topics files
var signin = require('./services/signin.js');
var signup = require('./services/signup.js');
var getProfileData = require('./services/getProfileData.js');
var getCourses = require('./services/getCourses.js');
// var getDepartment = require('./services/getDepartment.js');
// var getTerm = require('./services/getTerm.js');
var getCourseDetails = require('./services/getCourseDetails.js');
var getAnnouncements = require('./services/getAnnouncements.js');
var getAnnouncement = require('./services/getAnnouncement.js');
var addAnnouncements = require('./services/addAnnouncements.js');
var getAssignments = require('./services/getAssignments.js');
var getAssignDetails = require('./services/getAssignDetails.js');
var addAssignment = require('./services/addAssignment.js');
var getGrades = require('./services/getGrades.js');
var updateGrade = require('./services/updateGrade.js');
var getQuizzes = require('./services/getQuizzes.js');
var getQuiz = require('./services/getQuiz.js');
var getQuestions = require('./services/getQuestions.js');
var submitAnswers = require('./services/submitAnswers.js');
var createQuiz = require('./services/createQuiz.js');
var getSubmissions = require('./services/getSubmissions.js');
var getAllSubmissions = require('./services/getAllSubmissions.js');
var submitAssignment = require('./services/submitAssignment.js');
var getFiles = require('./services/getFiles.js');
var updateCourseOrder = require('./services/updateCourseOrder.js');
var getCoursePeople = require('./services/getCoursePeople.js');
var updateImage = require('./services/updateImage.js');
var updateProfile = require('./services/updateProfile.js');
var getProfileImage = require('./services/getProfileImage.js');
var addCourse = require('./services/addCourse.js');
var searchCourses = require('./services/searchCourses.js');
var getEnrollmentData = require('./services/getEnrollmentData.js');
var addCourseEnrolled = require('./services/addCourseEnrolled.js');
var dropCourseEnrolled = require('./services/dropCourseEnrolled.js');
var waitlistCourse = require('./services/waitlistCourse.js');
var generatePermissions = require('./services/generatePermissions.js');
var addCourseWithPermission = require('./services/addCourseWithPermission.js');
var getMessages = require('./services/getMessages.js');
var sendMessages = require('./services/sendMessages.js');
var uploadFile = require('./services/uploadFile.js')
var getSubmissionFile = require('./services/getSubmissionFile.js')
var getFile = require('./services/getFile.js')

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('Handle topic: ' + topic_name);
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("signin",signin)
handleTopicRequest("signup",signup)
handleTopicRequest("getProfileData",getProfileData)
handleTopicRequest("getCourses",getCourses)
// handleTopicRequest("getDepartment",getDepartment)
// handleTopicRequest("getTerm",getTerm)
handleTopicRequest("getCourseDetails",getCourseDetails)
handleTopicRequest("getAnnouncements",getAnnouncements)
handleTopicRequest("getAnnouncement",getAnnouncement)
handleTopicRequest("addAnnouncements",addAnnouncements)
handleTopicRequest("getAssignments",getAssignments)
handleTopicRequest("getAssignDetails",getAssignDetails)
handleTopicRequest("addAssignment",addAssignment)
handleTopicRequest("getGrades",getGrades)
handleTopicRequest("updateGrade",updateGrade)
handleTopicRequest("getQuizzes",getQuizzes)
handleTopicRequest("getQuiz",getQuiz)
handleTopicRequest("getQuestions",getQuestions)
handleTopicRequest("submitAnswers",submitAnswers)
handleTopicRequest("createQuiz",createQuiz)

handleTopicRequest("getSubmissions",getSubmissions)
handleTopicRequest("getAllSubmissions",getAllSubmissions)
handleTopicRequest("submitAssignment",submitAssignment)
handleTopicRequest("getFiles",getFiles)
handleTopicRequest("updateCourseOrder",updateCourseOrder)
handleTopicRequest("getCoursePeople",getCoursePeople)
handleTopicRequest("updateImage",updateImage)
handleTopicRequest("updateProfile",updateProfile)
handleTopicRequest("getProfileImage",getProfileImage)
handleTopicRequest("addCourse",addCourse)
handleTopicRequest("searchCourses",searchCourses)
handleTopicRequest("getEnrollmentData",getEnrollmentData)
handleTopicRequest("addCourseEnrolled",addCourseEnrolled)
handleTopicRequest("dropCourseEnrolled",dropCourseEnrolled)
handleTopicRequest("waitlistCourse",waitlistCourse)
handleTopicRequest("generatePermissions",generatePermissions)
handleTopicRequest("addCourseWithPermission",addCourseWithPermission)
handleTopicRequest("getMessages",getMessages)
handleTopicRequest("sendMessages",sendMessages)
handleTopicRequest("uploadFile",uploadFile)
handleTopicRequest("getSubmissionFile",getSubmissionFile)
handleTopicRequest("getFile",getFile)
