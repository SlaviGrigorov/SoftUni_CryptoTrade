const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const {SALTROUNDS} = require('../constants');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: [5, 'Username must contain at least 4 characters!'],
    },
    email: {
        type: String,
        required: true,
        minlength: [10, `Email should be at least 10 characters long!`],
    },
    password: {
        type: String,
        required: true,
        minlength: [4, 'Password must contain at least 3 characters!'],
    },
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, SALTROUNDS)
        .then(hashedPassword => {
            this.password = hashedPassword;
            next();
        });
});

const User = mongoose.model('User', userSchema);

module.exports = User;