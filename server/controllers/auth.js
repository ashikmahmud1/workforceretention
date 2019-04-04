const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/user');
const uuidv4 = require('uuid/v4');

const refreshTokens = {};

//Config
const config = require('../config');

// AuthController responsibility is login, logout, generate a new token, delete a token from the server

/**
 * this is used to authenticate employee to our api using email and password
 * POST api/v1/employee/login
 * @param req
 * @param res
 */

exports.login = function (req, res, next) {

    const {email, password} = req.body;
    /**
     * this is param checking if they are provided
     */
    if (!password || !email) {
        return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide email and password!'}]});
    }

    /**
     * check if the username matches any email
     */

    User.findOne({email}).then((user, err) => {
        if (err) throw new Error("Unable to find user with the email " + email);

        if (!user) {
            const error = new Error("User not found, please sign up.");
            error.statusCode = 401;
            throw error
        }
        //check if the entered password is correct
        bcrypt.compare(password, user.password, function (error, matched) {
            if (error) return next(error);

            if (!matched) {
                const error = new Error("Invalid password.");
                error.statusCode = 400;
                return next(error)
            }

            //save the date the token was generated for already inside toJSON()
            const userData = user.toJSON();

            delete userData.surveys;
            delete userData.password;
            delete userData.clients;
            delete userData.links;

            //Generate refresh token
            let refreshToken = uuidv4();
            refreshTokens[refreshToken] = email;

            //save the refreshToken inside the userData
            userData.refreshToken = refreshToken;

            let token = jwt.sign(userData, config.SECRET, {
                expiresIn: '7d'
            });

            //return the token here
            res.json({token});
        });
    }).catch(err => {
        next(err)
    });
};

/**
 * this is used to request for another token when the other token is about
 * expiring so for next request call the token can be validated as true
 * GET /api/v1/employee/token
 * @param req
 * @param res
 */

exports.token = function (req, res, next) {
    let email = req.body.email;
    let refreshToken = req.body.refreshToken;

    if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] === email)) {
        User.findOne({email}).then((user, err) => {
            if (err) return next(err);
            if (!user) {
                const error = new Error("User not found, please sign up.");
                error.statusCode = 401;
                return next(error);
            }

            const userData = user.toJSON();
            userData.refreshToken = refreshToken;

            delete userData.surveys;
            delete userData.password;
            delete userData.clients;
            delete userData.links;

            const token = jwt.sign(userData, config.SECRET, {
                expiresIn: '7d'
            });
            return res.json({token});
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
    } else {
        const error = new Error("User not found, please sign up.");
        error.statusCode = 401;
        return next(error)
    }
};

/**
 * this is used to request for another token when the other token is about
 * expiring so for next request call the token can be validated as true
 * GET /api/v1/employee/logout
 * @param req
 * @param res
 */
exports.logout = function (req, res) {
    let refreshToken = req.body.refreshToken;
    if (refreshToken in refreshTokens) {
        delete refreshTokens[refreshToken]
    }
    return res.status(200).json({success: true})
};

