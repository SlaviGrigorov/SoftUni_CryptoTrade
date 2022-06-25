const router = require('express').Router();
const cryptoService = require('../services/cryptoService');
const { isUser, isGuest } = require('../middleware/authMiddleware');

router.get('/catalog', async (req, res) => {
    try {
        let cryptoData = await cryptoService.getAll().lean();
        res.render('crypto/catalog', { cryptoData });
    } catch (error) {
        console.log(error);
    }
});

router.get('/create', isUser, (req, res) => {
    res.render('crypto/create');
});

router.post('/create', isUser, async (req, res) => {
    let crypto = req.body;
    crypto.owner = req.user._id;
    try {
        await cryptoService.create(req.body);
        res.redirect('/crypto/catalog');
    } catch (error) {
        return res.render('crypto/create', { error: Object.values(error.errors)[0].message });
    }
});

router.get('/details/:id', async (req, res) => {
    try {
        let crypto = await cryptoService.getOne(req.params.id).lean();

        //Check if user is owner
        let isOwner = false;
        if(req.user) {
            isOwner = crypto.owner == req.user._id;
        }

        //Check if user bought this crypto
        let bought = false;
        if(req.user) {
            if (crypto.buyers.find(user => user == req.user._id)){
                bought = true;
            }
        }

        res.render('crypto/details', { crypto, isOwner, bought});

    } catch (error) {
        console.log('error:', error);
    }
});

router.get('/buy/:id', async (req, res) => {
    let cryptoId =  req.params.id;
    let userId = req.user._id;

    try {
        await cryptoService.buyCrypto(cryptoId, userId)
        res.redirect(`/crypto/details/${cryptoId}`);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

router.get('/edit/:id', async (req, res) => {
    let crypto = await cryptoService.getOne(req.params.id).lean();
    res.render('crypto/edit', { crypto })
});

router.post('/edit/:id', async (req, res) => {
    await cryptoService.edit(req.params.id, req.body);

    res.redirect(`/crypto/details/${req.params.id}`)
});

router.get('/delete/:id', async (req, res) => {
    await cryptoService.delete(req.params.id);
    res.redirect('/crypto/catalog');
});

router.get('/search', async (req, res) => {
    let crypto = await cryptoService.getAll().lean();
    res.render('crypto/search', { crypto });
});

router.post('/search', async (req, res) => {
    let {name, payment} = req.body;
    let crypto = await cryptoService.search(name, payment);
    res.render('crypto/search', { crypto });
});