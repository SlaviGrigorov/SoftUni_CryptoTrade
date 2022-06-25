const router = require('express').Router();
const cryptoService = require('../services/cryptoService');

router.get('/', (req, res) => {
    res.render('home');
});

module.exports = router;