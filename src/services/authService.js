const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { SECRET } = require('../constants');

exports.create = (userData) => User.create(userData);

exports.login = async ({email, password}) => {
    // Check for empty fields
    if (!email || !password) {
        throw(`Please fill all fields!`);
    }

    // Check if user exists in DB
    let user = await User.findOne({email});
    if(!user) {
        throw (`Invalid username or password!`);
    }

    // Validate Password
    let validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
        throw ('Invalid username or password!');
    };

    return user;
}

exports.createUserToken = (user) => {
    //Create token
    let jwtSignPromisify = promisify(jwt.sign);
    const payload = {_id: user._id, username: user.username};
    const options = {expiresIn: '2d'};
    return jwtSignPromisify(payload, SECRET, options);
}