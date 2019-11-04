var {UserModel} = require('../MongoDbConnection');

function handle_request(msg, callback){
    console.log("INSIDE GETMESSAGES IN KAFKA BACKEND");
    let condition = {_id:msg.userid}
    let projection = {inbox_sent:1, name:1}
    if(msg.messageType == "inbox" || msg.messageType == null){
        projection = {inbox_received:1, name:1}
    }
    UserModel.findOne(condition, projection, function(err, findUser){
        if(err || findUser == null){
            callback(null, {messages:[]})
        } else {
            console.log(findUser);
            let messageArray = [];
            if(msg.messageType == "inbox" || msg.messageType == null){
                findUser.inbox_received.forEach(message => {
                    messageArray.push({
                        id: message._id,
                        messagerId: message.receivedFrom,
                        from:message.receivedFromName,
                        to:findUser.name,
                        course:message.courseName,
                        subject: message.subject,
                        content:message.content,
                        timestamp:message.timestamp
                    });
                });
            } else {
                findUser.inbox_sent.forEach(message => {
                    messageArray.push({
                        id: message._id,
                        messagerId: message.sentTo,
                        to:message.sentToName,
                        from:findUser.name,
                        course:message.courseName,
                        subject: message.subject,
                        content:message.content,
                        timestamp:message.timestamp
                    });
                });
            }
            callback(null, {messages:messageArray})
        }
        
    });
};

exports.handle_request = handle_request;


