const router = require('express').Router();
const authService = require('../services/authService');
const { SESSION_NAME } = require('../constants');
const { isUser, isGuest } = require('../middleware/authMiddleware');
const { isEmail } = require('validator');

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
    try {
        let user = await authService.login(req.body);
        let token = await authService.createUserToken(user);

        // ? If there is 404 and somehow token fails
        // if(!token) {
        //     res.render('404');
        // }

        //Create session with jwt token
        res.cookie(SESSION_NAME, token, { httpOnly: true });
        res.redirect('/');

    } catch (error) {
        return res.status(400).render('auth/login', { error: error });
    }
});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    const {username, email, password, repeatPassword} = req.body;
    console.log(req.body);
    // Validation
    if ( !username || !password || !email) {
    return res.render('auth/register', { error: `All fields are required!`});

    };
    if(!isEmail(email)) {
        return res.render('auth/register', {error: `Please enter a valid email!`});
    }
    if ( password !== repeatPassword ){
        return res.render('auth/register', { error: `Passwords don't match!`});
    };
    // End of validation

    // Create user
    try {
        let createdUser = await authService.create({username, email, password});

        // IF user must be logged in automaticaly and redirected to home page !
        let token = await authService.createUserToken(createdUser);
        res.cookie(SESSION_NAME, token, { httpOnly: true });
        //

        res.redirect('/');

    } catch (error) {
        return res.render('auth/register', { error: Object.values(error.errors)[0].message });
    }
});

router.get('/logout', isUser, (req, res) => {
    res.clearCookie(SESSION_NAME);
    res.redirect('/');
});

module.exports = router;