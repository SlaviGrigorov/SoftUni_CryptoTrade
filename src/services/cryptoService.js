const Crypto = require('../models/Crypto');

exports.create = (data) => Crypto.create(data);

exports.getAll = () => Crypto.find();

exports.getOne = (id) => Crypto.findById(id)

exports.edit = (cryptoId, data) => Crypto.findByIdAndUpdate(cryptoId, data);

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);

exports.buyCrypto = async (cryptoId, userId) => {
    let crypto = await Crypto.findById(cryptoId);
    
    crypto.buyers.push(userId);

    crypto.save();

    return crypto;
};

exports.search = async (name, payment) => {
    let crypto = await Crypto.find({name: {$regex: new RegExp(name, 'i')}}).lean();
    crypto = crypto.filter(x => x.payment == payment);
    return crypto;
}