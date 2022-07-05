const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Name is required!`],
        minlength: [2, `Name should be atleast 2 characters long!`],
    },
    imageUrl: {
        type: String,
        required: [true, `Image is required!`],
        validate: {
            validator: function(value){
                return value.startsWith('http');
            },
            message: 'Image should come from a link!'
        }
    },
    price: {
        type: Number,
        required: [true, `Price is required!`],
        min: [0, 'Price should be a possitive number!'],
    },
    description: {
        type: String,
        required: [true, `Description is required!`],
        minlength: [10, `Description should be atleast 10 characters long!`],
    },
    payment: {
        type: String,
        required: true,
    },
    buyers: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;