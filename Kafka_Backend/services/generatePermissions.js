var {CourseModel} = require('../MongoDbConnection')
const uuidv4 = require('uuid/v4');

function handle_request(msg, callback){
    // let values = ""
    // const endValues = "',"+msg.courseid+",0,"+msg.faculty_id+"),"
    // const permNumbers = [];
    // for(i=0;i<msg.num_to_generate;i++) {
    //     permNumbers.push(uuidv4());
    // }
    // for(i=0;i<permNumbers.length;i++) {
    //     const permNumber = permNumbers[i];
    //     values += "('" + permNumber +endValues
    // }
    // values = values.substring(0, values.length-1);

    CourseModel.findOne({_id: msg.courseid}, {permissions:1}, function(err, findCourse){
        if(err || findCourse == null){
            console.log("ERROR: " + err)
            callback(null, {permissions:[]})
        }else {
            if(findCourse.permission_numbers == null) {
                findCourse.permission_numbers = [];
            }
            const permNumbers = [];
            for(i=0;i<msg.num_to_generate;i++) {
                permNumbers.push(uuidv4())
            }
            permNumbers.forEach(pn => {
                findCourse.permission_numbers.push({
                    permission_id: pn,
                    is_used:false
                })
            });
            findCourse.save(function (err, result) {
                if (err) {
                    console.log(err)
                    callback(null, {permissions:[]})
                }else{
                    callback(null, {permissions:permNumbers})
                }
            });
        }
    })


    // const query = 'INSERT INTO permission VALUES '+values;
    // //console.log(query)
    // mysqlconnection.query(query, (err, result) => {
    //     if(err){
    //         console.log(err);
    //         callback(null, {permissions:[]})
    //     } else{
    //         callback(null, {permissions:permNumbers})
    //     }
    // });
};

exports.handle_request = handle_request;


