const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { SESSION_NAME, SECRET } = require('../constants');

const promisifyJwtVerify = promisify(jwt.verify);

exports.authentication = async (req, res, next) => {
    let token = req.cookies[SESSION_NAME];

    if (token) {
        try {
            let decodedToken = await promisifyJwtVerify(token, SECRET,);
            req.user = decodedToken;
            res.locals.user = decodedToken; // gives "user" access to views
        } catch (error) {
            console.log(error);
            return res.redirect('/auth/login');
        }
    };

    next();
};

exports.isUser = (req, res, next) => {
    if(!req.user) {
        return res.redirect('/auth/login');
    }
    next();
}

exports.isGuest = (req, res, next) => {
    if(req.user) {
        return res.redirect('/');
    }
    next();
}