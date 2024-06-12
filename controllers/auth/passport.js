const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('../../models/models.js'),
  passportJWT = require('passport-jwt'),
  userController = require('../users.js');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      await Users.findOne({ Username: username })
      .then((user) => {
        if (!user) {
          return callback(null, false, {
            message: 'Incorrect username.',
          });
        } else {
          const check = userController.validatePassword(username, password)
          if (password === user.Password) {
            return callback(null, user, {message: 'Password correct'})
          } else {
            return callback(null, false, {message: 'Incorrect password'})
          }
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          return callback(error);
        }
      })
    }
  )
);


passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret',
  passReqToCallback: true
}, async (req, jwtPayload, callback) => {
  try {
    const user = await Users.findById(jwtPayload.id);
    const role = user.Role;
    if (!user) {
      return callback(null, false, {message: "User not found"})
    }

    if (role === req.requiredRole) {
      return callback(null, user);
    } else {
      return callback(null, false, {message: "Insufficient Privileges"})
    }
  }
   catch(error){
      return callback(error)
    }
}))