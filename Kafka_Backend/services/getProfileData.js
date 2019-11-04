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
        if(existingUser == null){
            callback(null, {success:false});    
        }else{
            callback(null, {
                success:true, 
                name:existingUser.name,
                email:existingUser.email,
                phonenumber:existingUser.phone,
                aboutme:existingUser.about_me,
                city:existingUser.city,
                country:existingUser.country,
                company:existingUser.company,
                school:existingUser.school,
                hometown:existingUser.hometown,
                languages:existingUser.languages,
                gender:existingUser.gender
           })
        }
    })
}

//    query = 'SELECT * from users where user_id=?'
//    mysqlconnection.query(query,[msg.userid],(err,rowsOfTable)=>{
//        if(err){
//             console.log(err);
//             callback(null, {success:false});
//        }else if(rowsOfTable.length ==1){
//             callback(null, {
//                 success:true, 
//                 name:rowsOfTable[0].user_name,
//                 email:rowsOfTable[0].user_email,
//                 phonenumber:rowsOfTable[0].phonenumber,
//                 aboutme:rowsOfTable[0].about_me,
//                 city:rowsOfTable[0].city,
//                 country:rowsOfTable[0].country,
//                 company:rowsOfTable[0].company,
//                 school:rowsOfTable[0].school,
//                 hometown:rowsOfTable[0].hometown,
//                 languages:rowsOfTable[0].languages,
//                 gender:rowsOfTable[0].gender
//            })
//        } else{
//             callback(null, {
//                 success:false
//             })
//        }
//    });

exports.handle_request = handle_request;


