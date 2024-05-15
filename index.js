//access modules
const express = require('express'), 
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser');

app = express();
app.use(bodyParser.json());

//create log stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'}); 

//movie data
const faveMovies = 
    [
        {"title":"Dune","year":"2022","genre":"Sci-fi"},
        {"title":"Predator","year":"1988","genre":"Action"},
        {"title":"The Notebook","year":"2003","genre":"Romance"},
        {"title":"Moneyball","year":"2022","genre":"Sport History"},
        {"title":"The Terminator","year":"1986","genre":"Sci-fi"},
        {"title":"Mortal Engines","year":"2012","genre":"Fantasy"}
    ]    


//logstream middleware
app.use(morgan('combined', {stream: accessLogStream})); 

app.use(express.static('public'));

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
  });

  //Documentation page as home page
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
        faveMovies.push(newMovie);
        res.status(201).send(newMovie);
    }
})

//Get all movies
app.get('/movies', (req, res) => {
    res.status(200).json(faveMovies)
});

app.get('/movies/:title', (req, res) => {
    const result = faveMovies.find(movie => movie.title === req.params.title);

    if (!result) {
        res.status(404).send('Movie not found');
    } else {
        res.status(200).json(result);
    }
});

app.get('/documentation', (req, res) => {
    res.status(200).sendFile('documentation.html', {root: __dirname + '/public'});
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
})