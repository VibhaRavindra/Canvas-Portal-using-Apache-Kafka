var {CourseModel, UserModel} = require('../MongoDbConnection');

function handle_request(msg, callback){

    var addCourse = new CourseModel({ 
        course_id: msg.courseid,
        dept_id: msg.department, 
        term: msg.term, 
        course_name: msg.coursename, 
        capacity: msg.coursecapacity,
        waitlist_capacity: msg.waitcapacity,
        course_desc: msg.coursedesc,
        course_room: msg.courseroom,
        faculty_id: msg.userid,
        total_waitlisted:0,
        total_enrolled:0
    });

    CourseModel.findOne({course_id: msg.courseid, dept_id: msg.department, term: msg.term}, function(err, existingCourse){
        if(err){
            callback(null, {success:false})
            throw err;
        }
        if(existingCourse == null){
            UserModel.findOne({_id:msg.userid}, function(err, existingUser){
                if(err || existingUser == null) {
                    callback(null, {success:false})
                    throw err;
                } else {        
                    if (existingUser.course_handled == null) {
                        // making new array
                        existingUser.course_handled = [addCourse._id]
                    } else {
                        // adding to existing array
                        existingUser.course_handled.push(addCourse._id)
                    }
                    existingUser.save(function (err, result) {
                        if (err) {
                            callback(null, {success:false})
                        }else{
                            addCourse.faculty_name = existingUser.name;
                            addCourse.save(function (err, result) {
                                if (err) {
                                    callback(null, {success:false})
                                }else{
                                    callback(null, {success:true})
                                }
                            });
                        }
                    });
                }
            });
        }else {
            callback(null, {success:false})
        }
    })

    
};

exports.handle_request = handle_request;


