var {UserModel} = require('../MongoDbConnection');
// const mysql = require('mysql');

// var mysqlconnection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "rootPassword",
//     database: "Canvas"
// });
  
// mysqlconnection.connect(err => {
//     if (err) 
//     throw err;
// })

function handle_request(msg, callback){
    UserModel.findOne({_id:msg.userid}, {profile_image:1}, (err, findUser)=>{
        if(err || findUser == null) {
            callback(null, {success:false})
        } else {
            findUser.profile_image = msg.imageData;
            findUser.save((err, result)=>{
                if(err)
                    callback(null, {success:false})
                else
                    callback(null, {success:true})
            })
        }
    })
    // const query = 'INSERT INTO user_image VALUES(?,?) ON DUPLICATE KEY UPDATE previewimage=?'
    // mysqlconnection.query(query,[msg.userid, msg.imageData, msg.imageData],(err,response)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {success:false})
    //     }else{
    //         callback(null, {success:true})
    //     }
    // });
};

exports.handle_request = handle_request;


