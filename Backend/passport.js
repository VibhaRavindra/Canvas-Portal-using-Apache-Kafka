var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "BRahujBqkZDAHMtYKoPP"
    };
    passport.use('jwt',new JwtStrategy(opts, function (jwt_payload, callback) {
        console.log("in passport jwt strategy")
        if(jwt_payload.IsLoggedIn) {
            console.log("user is authorized")
            callback(null, jwt_payload);
        } else {
            console.log("UnAuthorized User")
            callback("Not valid token", false)
        }
    }));
    passport.use('faculty',new JwtStrategy(opts, function (jwt_payload, callback) {
        console.log("in passport faculty strategy")
        if(jwt_payload.IsLoggedIn && !jwt_payload.isStudent) {
            console.log("user is authorized")
            callback(null, jwt_payload);
        } else {
            console.log("UnAuthorized User")
            callback("Not valid token", false)
        }
    }));
};
