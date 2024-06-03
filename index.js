//access modules
const express = require('express'), 
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    models = require('./models/models.js'),
    movies = require('./controllers/movies.js'),
    users = require('./controllers/users.js');

app = express();

app.use(bodyParser.json());

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
app.get('/movies', movies.listAllMovies); //list all movies
app.get('/movies/:Title', movies.getMovieByTitle);//Get movie by title
app.post('/movies', movies.addMovie); //Adds a movie to the library
app.put('/movies/:Title', movies.updateGenreByMovieTitle); //Update Genre info for a movie by its title
app.delete('/movies/:id', movies.deleteMovieById); //Delete a movie by ID

//User routes
app.get('/users', users.listUsers); //Lists all users
app.get('/users/:id', users.getUserById); //Gets a user by its id
app.post('/users', users.addUser); //Add a user
app.delete('/users/:id', users.deleteUser); //Delete a user
app.post('/users/:id/:movieId', users.addMovie); //Add a favourite movie to a user
app.delete('/users/:id/:movieId', users.deleteMovie); //Deletes a fovurite movie from a user

app.listen(8080, () => {
    console.log('Listening on port 8080');
})