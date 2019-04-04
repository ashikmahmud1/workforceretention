const jwt = require("jsonwebtoken");
const User = require('../models/user');
//Config
const config = require('../config');

exports.auth = function (req, res, next) {
    let bearerToken;
    let bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        let bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];

        if (bearer[0] !== "Bearer") {
            return res.forbidden("bearer not understood");
        }

        //verify if this token was from us or not
        jwt.verify(bearerToken, config.SECRET, function (err, decoded) {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    const error = new Error("Session timed out, please login again");
                    error.statusCode = 401;
                    throw error
                } else {
                    throw err
                }
            }


            User.findOne(decoded.id).then((user, error) => {
                if (error) throw error;

                if (!user) {
                    const error = new Error("User not found, please sign up.");
                    error.statusCode = 422;
                    throw error
                }
                //Here check the employee permission with the request.
                //needs to populate role than populate role permission
                req.user = user;
                next()
            }).catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err)
            })

        });

    } else {
        const error = new Error("No token provided");
        error.statusCode = 403;
        next(error)
    }
};
