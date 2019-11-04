var {UserModel} = require('../MongoDbConnection');

function handle_request(msg, callback){
    UserModel.findOne({"assignment_submissions.submissions._id":msg.submissionid },{_id: 0,"assignment_submissions.$":1}, function(err, findFile){
        if(err || findFile == null) {
            callback("File not found", null)
        } else {
            let found = false;
            findFile.assignment_submissions[0].submissions.forEach(element => {
                if (element._id == msg.submissionid) {
                    found = true;
                    callback(null, {
                        localfilename: element.localfilename,
                        filename: element.user_filename
                    })
                }
            });
            if(!found)
            callback("File not found", null)
            
        }
    })
}
exports.handle_request = handle_request;