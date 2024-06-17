require('dotenv').config();
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('../../models/models.js'),
  passportJWT = require('passport-jwt');

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
        } if (!user.validatePassword(password)) {

          console.log('incorrect password');
          return callback(null, false, { message: 'Incorrect password.' });
        }
        return callback(null, user);
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
  secretOrKey: process.env.PASSPORT_KEY,
  passReqToCallback: true
}, async (req, jwtPayload, callback) => {
  try {
    const user = await Users.findById(jwtPayload.id);
    const role = user.Role;
    if (!user) {
      return callback(null, false, {message: "User not found"})
    }

    if (role === req.requiredRole || role === 'sysAdmin') {
      return callback(null, user);
    } else {
      return callback(null, false, {message: "Insufficient Privileges"})
    }
  }
   catch(error){
      return callback(error)
    }
}))