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
            findUser.name=msg.name;
            findUser.email=msg.email;
            findUser.phone=msg.phonenumber;
            findUser.about_me=msg.aboutme
            findUser.city=msg.city
            findUser.country=msg.country
            findUser.company=msg.company
            findUser.school=msg.school
            findUser.hometown=msg.hometown
            findUser.languages=msg.languages.split(",")
            findUser.gender=msg.gender
            findUser.save((err, result)=>{
                if(err)
                    callback(null, {success:false})
                else
                    callback(null, {success:true})
            })
        }
    })
    // const query = 'UPDATE users SET user_name=?, user_email=?, phonenumber=?, about_me=?, city=?, country=?, company=?, school=?, hometown=?, languages=?, gender=? where user_id=?'
    // mysqlconnection.query(query,[msg.name,msg.email,msg.phonenumber,msg.aboutme,msg.city,msg.country,msg.company,msg.school,msg.hometown,msg.languages,msg.gender,msg.userid],(err,response)=>{
    //     if(err){
    //         console.log(err);
    //         callback(null, {success:false})
    //     }else{
    //         callback(null, {success:true})
    //     }
    // });
};

exports.handle_request = handle_request;


