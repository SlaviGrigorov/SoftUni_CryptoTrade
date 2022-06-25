const mongoose = require('mongoose');
const { DB_QUERYSTRING } = require('../constants');

// Option 1
// exports.initializeDatabase = () => mongoose.connect(DB_QUERYSTRING);

//Option 2
exports.initializeDatabase = () => {
    mongoose.connection.on('open', () => console.log('Db is connected!'));
    return mongoose.connect(DB_QUERYSTRING);
}

