var {CourseModel} = require('../MongoDbConnection');

function handle_request(msg, callback){
    CourseModel.findOne({ "files._id":msg.fileid },{_id: 0,"files.$":1}, function(err, findFile){
        if(err || findFile == null) {
            callback("File not found", null)
        } else {
            console.log(findFile)
            callback(null, {
                localfilename: findFile.files[0].localfilename,
                filename: findFile.files[0].filename
            })
        }
    })
}
exports.handle_request = handle_request;