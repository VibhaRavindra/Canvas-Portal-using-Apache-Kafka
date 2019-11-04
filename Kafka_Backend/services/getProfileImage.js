// const mysql = require('mysql');
var {UserModel} = require('../MongoDbConnection');
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
    UserModel.findOne({_id:msg.userid}, function(err, existingUser){
        if(err){
            callback(null, {success:false});
        }
        if(existingUser == null || existingUser.profile_image == null){
            callback(null, {success:false});
        }else{
            callback(null, {
                success:true,
                image:existingUser.profile_image
            });
        }
    });
    // const query='SELECT previewimage from user_image where user_id=?'
    // mysqlconnection.query(query,[msg.userid],(err,rowsOfTable)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {success:false})
    //     }else if(rowsOfTable.length ==1){
    //         callback(null, {success:true, image:rowsOfTable[0].previewimage})
    //     } else{
    //         callback(null, {success:false})
    //     }
    // });
};

exports.handle_request = handle_request;


