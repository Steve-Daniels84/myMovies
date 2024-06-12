const jwtSecret = 'your_jwt_secret'; 
const jwt = require('jsonwebtoken'),
      passport = require('passport');

require('./passport.js'); // Your local passport file


let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, 
    expiresIn: '7d', 
    algorithm: 'HS256' 
  });
}


/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {


    passport.authenticate('local', { session: false }, (error, user, info) => {
     
      let payload = {
        Username: user.Username,
        id: user.id,
        
      }

      if (error || !user) {
        return res.status(400).json({
          message: `${info.message}`,
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let response = { 
          "message": "Success",
          "token": generateJWTToken(payload)
        };
        return res.send(response);
      });
    })(req, res);
  });
}