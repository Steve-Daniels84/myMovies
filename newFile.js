const users = require('./controllers/users.js');
const { check, validationResult } = require('express-validator');
const requiredRole = require('./controllers/validations.js');
const passport = require('passport');

app.post('/users/:id/:movieId', [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
    console.log(req.body);
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
}, requiredRole('user'), passport.authenticate('jwt', { session: false }), users.addMovie); //Add a favourite movie to a user

