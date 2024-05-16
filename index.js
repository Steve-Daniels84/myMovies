//access modules
const express = require('express'), 
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

app = express();
app.use(bodyParser.json());

//create log stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'}); 

//movie data
let faveMovies = 
    [
        {"title":"Dune","year":"2022","genre":"Sci-fi","id":"1"},
        {"title":"Predator","year":"1988","genre":"Action", "id":"2"},
        {"title":"The Notebook","year":"2003","genre":"Romance", "id":"3"},
        {"title":"Moneyball","year":"2022","genre":"Sport History", "id":"4"},
        {"title":"The Terminator","year":"1986","genre":"Sci-fi", "id":"5"},
        {"title":"Mortal Engines","year":"2012","genre":"Fantasy", "id":"6"}
    ]    


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

//Add new movie into dataset
app.post('/movies', (req, res) => {
    const message = 'No movie data in request body'
    let newMovie = {};  

    if (!req.body) {
        res.status(400).send(message)
    } else {
        newMovie = req.body;
        newMovie.id = uuid.v4();
        faveMovies.push(newMovie);
        res.status(201).send(newMovie);
    }
})

//Get all movies
app.get('/movies', (req, res) => {
    res.status(200).json(faveMovies)
});

//find movie by title
app.get('/movies/:title', (req, res) => {
    const result = faveMovies.find(movie => movie.title === req.params.title);

    if (!result) {
        res.status(404).send('Movie not found');
    } else {
        res.status(200).json(result);
    }
});

//Routes to documentation page
app.get('/documentation', (req, res) => {
    res.status(200).sendFile('documentation.html', {root: __dirname + '/public'});
});

//Finds a movie and updates the genre
app.put('/movies/:title/:genre', (req, res) => {
    const movie = faveMovies.find(movie => movie.title === req.params.title);

    if(movie) {
        movie.genre = req.params.genre;
        res.status(201).send(movie.title + ' genre updated to ' + req.params.genre);
       
    } else {
        response.status(404).send('Movie not found!');
    }
})

//Deletes a movie from the dataset by its id
app.delete('/movies/:id', (req,res) => {
    const movie = faveMovies.find(movie => {return movie.id === req.params.id});

    if (movie) {
        faveMovies = faveMovies.filter((obj) => {return obj.id !== req.params.id});
        res.status(201).send(movie.title + ' was deleted successfully');
    }
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
})