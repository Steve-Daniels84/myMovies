const { check, validationResult } = require('express-validator');

const createUserRules = [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username must contain alphanumeric charaters only.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Password', 'Password must be at least 12 characters long.').isLength({min: 12}),
    check('Email', 'Email address is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail()
  ];

  const updateUserRules = [
    check('Username', 'Username must contain alphanumeric charaters only.').isAlphanumeric(),
    check('Email', 'Email does not appear to be valid.').isEmail(),
  ];

module.exports = {
    createUserRules
}