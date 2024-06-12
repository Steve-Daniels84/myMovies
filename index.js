//access modules
const express = require('express'), 
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    movies = require('./controllers/movies.js'),
    users = require('./controllers/users.js');
    
const requiredRole = require('./controllers/role.js');

app = express();

app.use(bodyParser.json());

let auth = require('./controllers/auth/auth.js')(app);

const passport = require('passport');
require('./controllers/auth/passport.js');

//create log stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'}); 

//logstream middleware
app.use(morgan('combined', {stream: accessLogStream})); 

app.use(express.static('public'));

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
  });

//Routes to documentation page as default
app.get('/', (req, res) => {
    res.status(200).sendFile('documentation.html', {root: __dirname + '/public'});
})

//Routes to documentation page
app.get('/documentation', (req, res) => {
    res.status(200).sendFile('documentation.html', {root: __dirname + '/public'});
});

//Movie routes
app.get('/movies', requiredRole('user'), passport.authenticate('jwt', { session: false }), movies.listAllMovies); //list all movies
app.get('/movies/:Title', requiredRole('user'), passport.authenticate('jwt', { session: false }), movies.getMovieByTitle);//Get movie by title
app.post('/movies', requiredRole('user'), passport.authenticate('jwt', { session: false }),  movies.addMovie); //Adds a movie to the library
app.put('/movies/:Title', requiredRole('sysAdmin'), passport.authenticate('jwt', { session: false }), movies.updateGenreByMovieTitle); //Update Genre info for a movie by its title
app.delete('/movies/:id', requiredRole('sysAdmin'), passport.authenticate('jwt', { session: false }), movies.deleteMovieById); //Delete a movie by ID

//User routes
app.get('/users', requiredRole('sysAdmin'), passport.authenticate('jwt', { session: false }),  users.listUsers); //Lists all users
app.get('/users/:id', passport.authenticate('jwt', { session: false }),  users.getUserById); //Gets a user by its id
app.put('/users/:id',passport.authenticate('jwt', { session: false }), users.updateUser); //Update a user
app.post('/users/', users.addUser); //Add a user
app.delete('/users/:id', passport.authenticate('jwt', { session: false }), users.deleteUser); //Delete a user
app.post('/users/:id/:movieId', passport.authenticate('jwt', { session: false }),  users.addMovie); //Add a favourite movie to a user
app.delete('/users/:id/:movieId', passport.authenticate('jwt', { session: false }),  users.deleteMovie); //Deletes a fovurite movie from a user

app.listen(8080, () => {
    console.log('Listening on port 8080');
})