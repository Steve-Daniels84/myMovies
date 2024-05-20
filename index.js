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
  {
    '_id': '664a60e30f0177a700e79dc0',
    'Title': 'The Avengers',
    'Description': "Earth's mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his alien army from enslaving humanity.",
    'Genre': {
      'Name': 'Action',
      'Description': 'Action film is a genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, and frantic chases.'
    },
    'Director': {
      'Name': 'Joss Whedon',
      'Bio': 'Joseph Hill Whedon is an American film director, producer, and screenwriter.',
      'Birth': '1964'
    },
    'ImagePath': 'avengers.png',
    'Featured': true,
    'movieId': '00001'
  },
  {
    '_id': '664a615e0f0177a700e79dc1',
    'Title': 'Titanic',
    'Description': 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    'Genre': {
      'Name': 'Romance',
      'Description': 'Romance film is a genre that focuses on the romantic relationships between characters.'
    },
    'Director': {
      'Name': 'James Cameron',
      'Bio': 'James Francis Cameron is a Canadian filmmaker and environmentalist.',
      'Birth': '1954'
    },
    'ImagePath': 'titanic.png',
    'Featured': true,
    'movieId': '00002'
  },
  {
    '_id': '664a6b0e0f0177a700e79dc7',
    'Title': 'The Lion King',
    'Description': 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
    'Genre': {
      'Name': 'Animation',
      'Description': 'Animation film is a genre in which the images are primarily created through animation techniques.'
    },
    'Director': {
      'Name': 'Roger Allers and Rob Minkoff',
      'Bio': 'Roger Allers is an American film director, screenwriter, and animator. Rob Minkoff is an American filmmaker.',
      'Birth': '1949 (Allers), 1962 (Minkoff)'
    },
    'ImagePath': 'lionking.png',
    'Featured': true,
    'movieId': '00010'
  }
];

const users = [
    
    {
      'id': '664a646d0f0177a700e79dc2',
      'Username': 'Stevil Kanevil',
      'Email': 'test1@test.com',
      'password': '123456',
      'Birthdate': '1984-02-02T00:00:00.000Z',
      'favouriteMovies': [ '00008', '00010']
    },
    {
      'id': '664a66110f0177a700e79dc3',
      'Username': 'test1',
      'Email': 'test2@test.com',
      'password': '123456',
      'Birthdate': '1999-01-09T00:00:00.000Z',
      'favouriteMovies': [ '00002', '00010', '00003', '00007', '00002' ]
    },
    {
      'id': '664a66110f0177a700e79dc4',
      'Username': 'test2',
      'Email': 'test3@test.com',
      'password': '1234556',
      'Birthdate': '1994-04-06T00:00:00.000Z',
      'favouriteMovies': [ '00010', '00005', '00004' ]
    },
    {
      'id': '664a66110f0177a700e79dc5',
      'Username': 'test3',
      'Email': 'test4@test.com',
      'password': '123456',
      'Birthdate': '2001-04-06T00:00:00.000Z',
      'favouriteMovies': [ '00007', '00001', '00002' ]
    },
    {
      'id': '664a66e10f0177a700e79dc6',
      'Username': 'test4',
      'Email': 'test4@test.com',
      'password': '123456',
      'Birthdate': '2012-04-05T00:00:00.000Z',
      'favouriteMovies': [ '00005', '00010', '00006' ]
    }
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
app.get('/movies/:Title', (req, res) => {
    const result = faveMovies.find(movie => movie.Title === req.params.Title);

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
    const movie = faveMovies.find(movie => movie.Title === req.params.title);

    if(movie) {
        movie.Genre.Name = req.params.genre;
        res.status(201).send(movie.Title + ' genre updated to ' + req.params.genre);
       
    } else {
        response.status(404).send('Movie not found!');
    }
})

//Deletes a movie from the dataset by its id
app.delete('/movies/:id', (req,res) => {
    const movie = faveMovies.find(movie => {return movie.movieId === req.params.id});

    if (movie) {
        faveMovies = faveMovies.filter((obj) => {return obj.id !== req.params.id});
        res.status(201).send(movie.Title + ' was deleted successfully');
    }
})

//Gets a list of all users
app.get ('/users', (req,res) => {
    res.status(200).json(users);
})

//Gets a user by id
app.get('/users/:id', (req,res) => {
    const user = users.find(user => {return user.id === req.params.id});
    if (!user) {
        res.status(400).send('User not found');
    } else {
        res.status(200).json(user);
    }
})

//Adds a user
app.post('/users', (req,res) => {
    user = req.body;

    if (user) {
        if (user.Username && user.Email && user.password && user.Birthdate) {
            user.id = uuid.v4();
            users.push(user);
            res.status(201).send('User added');
        } else {
            res.status(400).send('User must have a username, email, password and birthdate');
        }

    } else {
        res.status(400).send('Internal Server Error');
    }

})

//Updates a user any of the values on the user record
app.put('/users/:id', (req,res) => {
    const user = users.find(user => {return user.id === req.params.id});
    const {Username, Email, password, Birthdate} = req.body; 
        
    if (Username || Email || password || Birthdate) {   
        if (Username) user.Username = Username;
        if (Email) user.Email = Email;
        if (password) user.password = password;
        if (Birthdate) user.Birthdate = Birthdate;
        res.status(201).send('User updated');
    } else {
        res.status(400).send('Internal server error');
    }
})
//Add a favourite movie to a user
app.put('/users/:id/:movieId', (req,res) => {
    const user = users.find(user => {return user.id === req.params.id});
    const movieId = req.params.movieId;

    if (!user){
        res.status(400).send('User not found');
    }

    if (movieId) {
        user.favouriteMovies.push(movieId);
        res.status(201).send('Movie added to users favourites');
    } else {
        res.status(400).send('Movie not added');
    }
})

//Deletes a favourite movie from a user
app.delete('/users/:id/:movieId', (req,res) => {
    const user = users.find(user => {return user.id === req.params.id});
    const userMovies = user.favouriteMovies;
    const movieId = userMovies.find(movie => {movie === req.params.movieId});

    console.log(movieId.indexOf());

    

    console.log(userMovies);
    res.send('test');
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
})