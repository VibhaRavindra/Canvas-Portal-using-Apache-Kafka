var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Vibha:mongo123@canvas-49gwq.mongodb.net/canvas?retryWrites=true', {useNewUrlParser: true, poolSize: 10 });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Mongoose connected!")
});

var ObjectId = mongoose.Schema.Types.ObjectId;

//Children Schema for UserSchema
var SubmissionDetails = new mongoose.Schema({
    grade: Number,
    localfilename: String,
    user_filename: String,
    isgraded: Boolean,
    timestamp: Date
})
var AssignmentSubmissionSchema = new mongoose.Schema({
  course_id: ObjectId,
  assignment_id: ObjectId,
  assignment_title: String,
  total_points: Number,
  latest_submission: SubmissionDetails,
  submissions: [SubmissionDetails],
})
var QuizAnswersSchema = new mongoose.Schema({
    quiz_id: ObjectId,
    quiz_name: String,
    total_points: Number,
    course_id: ObjectId,
    score: Number
})
var EnrollmentSchema = new mongoose.Schema({
    course_id: ObjectId,
    status: String
})
var InboxSentSchema = new mongoose.Schema({
  sentTo: ObjectId,
  sentToName:String,
  subject: String,
  content: String,
  courseid: ObjectId,
  courseName: String,
  timestamp: String
})
var InboxReceivedSchema = new mongoose.Schema({
  receivedFrom: ObjectId,
  receivedFromName: String,
  subject: String,
  content: String,
  courseid: ObjectId,
  courseName: String,
  timestamp: String
})

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    phone: String,
    about_me: String,
    city: String,
    country: String,
    company: String,
    school: String,
    hometown: String,
    languages: [String],
    gender: String,
    profile_image: String,
    quiz_answers: [QuizAnswersSchema],
    assignment_submissions: [AssignmentSubmissionSchema],
    enrollment: [EnrollmentSchema],
    course_handled: [ObjectId],
    inbox_sent: [InboxSentSchema],
    inbox_received: [InboxReceivedSchema],
    course_order:[ObjectId]
},{collection:"users"})

//Children schema for QuizSchema
var QuestionSchema = new mongoose.Schema({
  question: String,
  points: Number,
  correct_option: String,
  option2: String,
  option3: String,
  option4: String
})

//Children schema for CourseSchema
var AnnouncementSchema = new mongoose.Schema({
    title: String,
    content: String,
    timestamp: String
})
var FileSchema = new mongoose.Schema({
    localfilename: String,
    filename: String,
    size: String,
    timestamp: String,
    created_by: String
})

var PermissionNumberSchema = new mongoose.Schema({
    permission_id: String,
    is_used: Boolean
})

var AssignmentSchema = new mongoose.Schema({
    course_id: ObjectId,
    title: String,
    points: Number
})

var QuizSchema = new mongoose.Schema({
  course_id: ObjectId,
  name: String,
  instructions: String,
  num_questions: Number,
  total_points: Number,
  questions: [QuestionSchema]
})

var CourseSchema = new mongoose.Schema({
    dept_id: String,
    course_id: Number,
    term: String,
    course_name: String,
    capacity: Number,
    waitlist_capacity: Number,
    total_waitlisted: Number,
    total_enrolled: Number,
    faculty_id: ObjectId,
    faculty_name: String,
    course_desc: String,
    course_room: String,
    permission_numbers: [PermissionNumberSchema],
    announcements: [AnnouncementSchema],
    assignments: [AssignmentSchema],
    files: [FileSchema],
    quizzes: [QuizSchema]
},{collection:"courses"})



var UserModel = mongoose.model('users', UserSchema);
var CourseModel = mongoose.model('courses', CourseSchema);
// var QuizModel = mongoose.model('quiz', CourseSchema);
module.exports = {
  UserModel,
  CourseModel
}