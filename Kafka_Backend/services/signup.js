const bcrypt = require('bcrypt');
const saltRounds = 1;
var {UserModel} = require('../MongoDbConnection');

function handle_request(msg, callback){
    let hashpw = bcrypt.hashSync(msg.password, saltRounds);
    UserModel.findOne({email:msg.email}, function(err, existingUser){
        if (err) {
            console.log("err UserModel.findOne")
            callback(null,{isInvalid: true, errMessage: "Sign Up Failed"})
        }
        if(existingUser == null){
            var newUser = new UserModel({ 
                name: msg.username, 
                email: msg.email, 
                password: hashpw, 
                role: msg.employee
            });
            newUser.save(function (err, result) {
                if (err) {
                    console.log("err newUser save")
                    callback(null,{isInvalid: true, errMessage: "Sign Up Failed"})
                }else{
                    console.log("all done")
                    callback(null, {isInvalid: false})
                }
            });     
        }else{
            console.log("User already exists")
            callback(null,{isInvalid: true, errMessage: "User already exists!"})
        }
    })      
};

exports.handle_request = handle_request;


