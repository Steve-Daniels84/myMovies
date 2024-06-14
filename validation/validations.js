const { check, validationResult } = require('express-validator');

const Models = require('../models/models.js');

let Users = Models.User;

// Validate required role for endpoints
function requiredRole(role) {
    return function (req, res, next) {
      req.requiredRole = role;
      next();
    };
  }

//Validate inputs for endpoint
function validateInput (req, res, next) {
  
  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      return next()
    }
}

//Validate user permission to access their record
function validateUserId (req, res, next) {
    if (req.params.id != req.user._id) {
      return res.status(400).send("You are only permitted to affect change to your own user");
    } else {
      return next()
    }
}
  
  module.exports = {requiredRole, validateInput, validateUserId}
  