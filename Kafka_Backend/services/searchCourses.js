var {CourseModel} = require('../MongoDbConnection');

function handle_request(msg, callback){   
    let searchObject = {};
    if (msg.courseNumber == "" && msg.courseName == "") {
        searchObject = {dept_id:msg.dept, term:msg.term}
        console.log("showing all courses for the dept and term");
    } else if(msg.courseNumber == "") {
        console.log("seraching for courses by name");
        searchObject = {dept_id:msg.dept, term:msg.term, course_name: {$regex:msg.courseName,$options:"i"}}
    } else if (msg.courseName == "") {
        searchObject = {dept_id:msg.dept, term:msg.term}
        console.log("searching for courses by number & condition");
        switch(msg.condition) {
            case "greater":
                searchObject.course_id = {$gte:msg.courseNumber}
                break;
            case "exactly":
                searchObject.course_id = msg.courseNumber
                break;
            case "lesser":
                searchObject.course_id = {$lte:msg.courseNumber}
                break;
        }
    } else {
        console.log("searching for courses by name, number & condition");
        searchObject = {dept_id:msg.dept, term:msg.term,course_name: {$regex:msg.courseName,$options:"i"}}
        switch(msg.condition) {
            case "greater":
                searchObject.course_id = {$gte:msg.courseNumber}
                break;
            case "exactly":
                searchObject.course_id = msg.courseNumber
                break;
            case "lesser":
                searchObject.course_id = {$lte:msg.courseNumber}
                break;
        }
    }
    CourseModel.find(searchObject, function(err, docs){
        if (err) {
            callback(null, {courses:[]})
        }
        if(docs == null){
            callback(null, {courses:[]}) 
        }else{
            let courseArray=[];
            for (i=0;i<docs.length;i++){

                const cap = docs[i].capacity;
                const wait_cap = docs[i].waitlist_capacity;
                const enrolled = docs[i].total_enrolled;
                const total_waitlisted = docs[i].total_waitlisted;
                let status = "Open"
                if (enrolled >= cap && total_waitlisted < wait_cap) {
                    status = "Waitlist"
                } else if (enrolled >= cap && total_waitlisted >= wait_cap) {
                    status = "Closed"
                }

                courseArray.push({
                    courseid:docs[i]._id,
                    deptid:docs[i].dept_id,
                    coursenumber:docs[i].course_id,
                    coursename:docs[i].course_name,
                    room:docs[i].course_room,
                    facultyname: docs[i].faculty_name,
                    status: status
                })
            }
            callback(null, {courses:courseArray}) 
        }
    })
};

exports.handle_request = handle_request;


