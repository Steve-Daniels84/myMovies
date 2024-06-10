const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('/Users/stephendaniels/Documents/Career_Foundry_Projects/myMovies/myMovies/models/models.js'),
  passportJWT = require('passport-jwt'),
  userController = require('/Users/stephendaniels/Documents/Career_Foundry_Projects/myMovies/myMovies/controllers/users.js');

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
  secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
  return await Users.findById(jwtPayload.id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));