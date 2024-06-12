// middleware/roleMiddleware.js
function requiredRole(role) {
    return function (req, res, next) {
      req.requiredRole = role;
      next();
    };
  }
  
  module.exports = requiredRole;
  