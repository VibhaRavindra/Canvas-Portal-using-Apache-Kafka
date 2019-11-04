var {CourseModel} = require('../MongoDbConnection');

function handle_request(msg, callback){
    CourseModel.findOne({_id:msg.courseid}, function(err, existingCourse){
        if(err || existingCourse == null) {
            callback(null, {success:false})
        } else {
            if(existingCourse.files == null) {
                existingCourse.files = []
            }
            existingCourse.files.push({
                localfilename: msg.localfilename,
                filename: msg.userfilename,
                size: msg.humanSize,
                timestamp: new Date().toLocaleString(),
                created_by:msg.createdby
            })
            existingCourse.save(function(err, result){
                if(err) {
                    callback(null, {success:false})
                } else {
                    callback(null, {success:true})
                }
            })
        }
    });
}

exports.handle_request = handle_request;