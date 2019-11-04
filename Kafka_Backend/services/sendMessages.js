var {CourseModel, UserModel} = require('../MongoDbConnection');

function handle_request(msg, callback){
    console.log("adding sent message")
    UserModel.findOne({_id:msg.to},function(err, findReceiver){
        if(err || findReceiver == null){
            callback(null,{success:false});
        } else {
            if(findReceiver.inbox_received == null){
                findReceiver.inbox_received = []
            }
            let currentTime = new Date();
            findReceiver.inbox_received.push({
                receivedFrom: msg.from,
                receivedFromName: msg.from_name,
                subject: msg.subject,
                content: msg.message,
                courseid: msg.course,
                courseName: msg.course_name,
                timestamp: currentTime              
            })
            UserModel.findOne({_id:msg.from},function(err, findSender){
                if(err || findSender == null){
                    callback(null,{success:false});
                } else {
                    if(findSender.inbox_sent == null){
                        findSender.inbox_sent = []
                    }
                    findSender.inbox_sent.push({
                        sentTo: msg.to,
                        sentToName: msg.to_name,
                        subject: msg.subject,
                        content: msg.message,
                        courseid: msg.course,
                        courseName: msg.course_name,
                        timestamp: currentTime              
                    })
                    findReceiver.save(function (err, result) {
                        if(err){
                            console.log(err);
                            callback(null,{success:false})
                        } else {
                            findSender.save(function (err, result) {
                                if(err){
                                    console.log(err);
                                    callback(null,{success:false})
                                } else {
                                    callback(null,{success:true})
                                }
                            });
                        }
                    });
                }
            });
            
        }
    });
};

exports.handle_request = handle_request;


