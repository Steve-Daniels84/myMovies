// Validate required role for endpoints
function requiredRole(role) {
    return function (req, res, next) {
      req.requiredRole = role;
      next();
    };
  }

//Validate inputs for endpoint
function validateInput (req) {
  const password = check(req.Password, 'Password is required').not().empty(),
    username = check(req.Username, 'Username can only contain alphanumeric characters').isAlphanumeric(),
    email = check(req.Email, 'Not a valid email address').isEmail();

    let passwordResult = false;
    let usernameResult = false;
    let emailResult = false;

    req.foreach((field) => {
      if (field.key === 'Password') {
        return password
      } else if (field === 'Username') {
        return username
      } if (field === 'Email') {
        return email
      }
    })
}
  
  module.exports = requiredRole, validateInput;
  