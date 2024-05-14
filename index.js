//access modules
const express = require('express'), 
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

app = express();

//create log stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'}); 

//movie data
const faveMovies = {
    "films":[
        {"title":"Dune","year":"2022","genre":"Sci-fi"},
        {"title":"Predator","year":"1988","genre":"Action"},
        {"title":"The Notebook","year":"2003","genre":"Romance"},
        {"title":"Moneyball","year":"2022","genre":"Sport History"},
        {"title":"The Terminator","year":"1986","genre":"Sci-fi"},
        {"title":"Mortal Engines","year":"2012","genre":"Fantasy"}
    ]    
}

//logstream middleware
app.use(morgan('combined', {stream: accessLogStream})); 

app.use(express.static('public'));

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
  });

app.get('/', (req, res) => {
    res.send ('Test')
})

app.post('/movies', (req, res) => {
    const message = 'No movie data in request body'
    if (!req.body) {
        res.status(400).send(message)
    } else {
        faveMovies.films.put()
    }
})

app.get('/movies', (req, res) => {
    res.status(200).json(faveMovies)
})

app.get('/documentation', (req, res) => {
    res.status(200).sendFile('documentation.html', {root: __dirname + '/public'});
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
})