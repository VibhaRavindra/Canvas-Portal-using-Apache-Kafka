var {UserModel} = require('../MongoDbConnection');

function handle_request(msg, callback){
    UserModel.findOneAndUpdate({_id:msg.userid}, {"$set":{course_order:msg.order}}, (err,result)=>{
        if(err){
            console.log(err)
            callback(null, {success:false})
        } else { 
            console.log("courrse order updated")
            callback(null, {success:true})
        }
    })
}

exports.handle_request = handle_request;