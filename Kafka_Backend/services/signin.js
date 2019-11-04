const bcrypt = require('bcrypt');
var {UserModel} = require('../MongoDbConnection');
function handle_request(msg, callback){
    UserModel.findOne({email:msg.email}, function(err, existingUser){
        if(err){
            callback(null, {
                IsInvalid: true, 
                isLoggedIn: false, 
                errMessage: "Sign In Failed"
            });    
        }
        if(existingUser == null){
            callback(null,{
                IsInvalid: true, 
                isLoggedIn: false, 
                errMessage: "No such User!"
            })     
        }else{
            var result = bcrypt.compareSync(msg.password, existingUser.password);
            if(result){
                callback(null, {
                    IsInvalid: false, 
                    isLoggedIn: true,
                    isStudent:existingUser.role == 'student',
                    userid:existingUser._id,
                    user_name: existingUser.name
                });
            }else{
                callback(null, {
                    IsInvalid: true, 
                    isLoggedIn: false, 
                    errMessage: "Incorrect Password"
                })
            }
        }
    })
};

exports.handle_request = handle_request;


