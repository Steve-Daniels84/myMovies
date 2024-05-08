const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

const faveMovies = {
    "films":[
        {"title":"1"},
        {"title":"2"}
    ]    
}

app.use(morgan('combined', {stream: accessLogStream}));

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.get('/', (req, res) => {
    res.send ('Test')
})

app.get('/movies', (req, res) => {
    res.json(faveMovies)
})

app.get('/documentation', (req, res) => {
    res.sendFile('documentation.html', {root: __dirname + '/public'});
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
})