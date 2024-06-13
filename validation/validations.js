const { check, validationResult } = require('express-validator');


// Validate required role for endpoints
function requiredRole(role) {
    return function (req, res, next) {
      req.requiredRole = role;
      next();
    };
  }

//Validate inputs for endpoint
function validateInput (req, res) {
  
  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      next();
    }
  
}
  
  module.exports = {requiredRole, validateInput}
  