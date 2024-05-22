//access modules
const express = require('express'), 
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    models = require('./models.js'),
    movies = models.Movie,
    users = models.User;

mongoose.connect('mongodb://localhost:27017/myMovies', {useNewUrlParser: true, useUnifiedTopology: true});

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

Add new movie into dataset
app.post('/movies', async (req, res) => {
    await movies.findOne({Title: req.body.Title})
        .then((movie) => {
            if (movie) {
                return res.status(400).send('Movie already exists')
            } else {
                console.log(req.body);
                movies
                    .create({
                            Genre: {
                              Name: req.body.Genre.Name,
                              Description: req.body.Genre.Description,
                            },
                            Director: {
                              Name: req.body.Director.Name,
                              Bio: req.body.Director.Bio,
                              Birth: req.body.Director.Birth
                            },
                            Actors: req.body.Actors,
                            Title: req.body.Title,
                            Description: req.body.Description,
                            ImagePath: req.body.ImagePath,
                            Featured: req.body.Featured,
                    })
                .then((movie) => {
                    res.status(201).json(movie)
                })
                .catch((error) => {
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            res.status(500).send('Error: ' + error);
        })
})

//Get all movies
app.get('/movies', (req, res) => {
    movies.find().then(movies => res.status(200).json(movies))
});

//find movie by title
app.get('/movies/:Title', (req, res) => {
movies.find({Title: req.params.Title})
.then((movies)=> {
        res.status(200).json(movies);
    }).catch((err) => {
        res.status(400).send('No movie found with the title ' + req.params.title);
    })
})

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
app.delete('/movies/:id', async (req,res) => {
    await movies.findOneAndDelete({ _id: req.params.id})
    .then((movies) => {
        if (!movies) {
            res.status(400).send('Movie ' + req.params.movieId + ' was not found');
        } else {
            res.status(200).send('movie ' + req.params.movieId + ' was deleted');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
})

//Gets a list of all users
app.get ('/users', (req,res) => {
    users.find().then(users => res.status(200).json(users));
})

//Gets a user by id
app.get('/users/:id', (req, res) => {
    users.find({'_id': req.params.id})
    .then((users)=> {
            res.status(200).json(users);
        }).catch((err) => {
            res.status(400).send('No user found with this Id');
        })
    })

//Adds a user
app.post('/users', async (req,res) => {
    await users.findOne({Username: req.body.Username})
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email
                    })
                .then((user) => {res.status(201).json(user)})
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    })
})

//Deletes a user from the dataset by its id
app.delete('/users/:id', async (req,res) => {
    const userId = req.params.id;
    await users.findOneAndDelete({ _id: req.params.id})
    .then((users) => {
        if (!users) {
            res.status(400).send('User ' + userId + ' was not found');
        } else {
            res.status(200).send('User ' + userId + ' was deleted');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
})

//Updates any of the values on the user record
app.put('/users/:id', async (req, res) => {
    await users.findOneAndUpdate({_id: req.params.id}, {
        $set:
            {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email
            }
        },
        {new:true})
    .then((updatedUser) => {
        res.status(201).json(updatedUser);
    })
    .catch((updatedUser) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
})


//Add a favourite movie to a user
app.post('/users/:id/:movieId', async (req,res) => {
    await users.findOneAndUpdate({ "_id":  req.params.id}, {
        $push: {FavouriteMovies: req.params.movieId}
    },
    {new: true})
    .then((updatedUser) => {
        res.status(200).json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
})

//Deletes a favourite movie from a user
app.delete('/users/:id/:movieId', async (req,res) => {
    try {
        const userId = req.params.id;
        const movieId = req.params.movieId;

        const updatedUser = await users.findOneAndUpdate(
            {"_id" : req.params.id},  
            {$pull: {FavouriteMovies: req.params.movieId}},
            {new:true}
        );

        if (!updatedUser) {
            return res.status(404).send({message: 'User not found'});        
        }
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).send({message: 'Error: ' + error});
    }
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
})