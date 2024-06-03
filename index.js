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

//Movie routes
app.get('/movies', movies.listAllMovies); //list all movies
app.get('/movies/:Title', movies.getMovieByTitle);//Get movie by title
app.post('/movies', movies.addMovie); //Adds a movie to the library
app.put('/movies/:Title', movies.updateGenreByMovieTitle); //Update Genre info for a movie by its title


// //Routes to documentation page
app.get('/documentation', (req, res) => {
    res.status(200).sendFile('documentation.html', {root: __dirname + '/public'});
});

// //Deletes a movie from the db by its id
// app.delete('/movies/:id', async (req,res) => {
//     const movieId = req.params.id;
//     await movies.findOneAndDelete({ _id: req.params.id})
//     .then((movies) => {
//         if (!movies) {
//             res.status(400).send('Movie ' + movieId + ' was not found');
//         } else {
//             res.status(200).send('movie ' + movieId + ' was deleted');
//         }
//     })
//     .catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//     })
// })

// //Gets a list of all users
// app.get ('/users', (req,res) => {
//     users.find().then(users => res.status(200).json(users));
// })

// //Gets a user by id
// app.get('/users/:id', (req, res) => {
//     users.find({'_id': req.params.id})
//     .then((users)=> {
//             res.status(200).json(users);
//         }).catch((err) => {
//             res.status(400).send('No user found with this Id');
//         })
//     })

// //Adds a user
// app.post('/users', async (req,res) => {
//     await users.findOne({Username: req.body.Username})
//         .then((user) => {
//             if (user) {
//                 return res.status(400).send(req.body.Username + ' already exists');
//             } else {
//                 users
//                     .create({
//                         Username: req.body.Username,
//                         Password: req.body.Password,
//                         Email: req.body.Email
//                     })
//                 .then((user) => {res.status(201).json(user)})
//                 .catch((error) => {
//                     console.error(error);
//                     res.status(500).send('Error: ' + error);
//                 })
//             }
//     })
//     .catch((error) => {
//         console.error(error);
//         res.status(500).send('Error: ' + error);
//     })
// })

// //Deletes a user from the dataset by its id
// app.delete('/users/:id', async (req,res) => {
//     const userId = req.params.id;
//     await users.findOneAndDelete({ _id: req.params.id})
//     .then((users) => {
//         if (!users) {
//             res.status(400).send('User ' + userId + ' was not found');
//         } else {
//             res.status(200).send('User ' + userId + ' was deleted');
//         }
//     })
//     .catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//     })
// })

// //Updates any of the values on the user record
// app.put('/users/:id', async (req, res) => {
//     await users.findOneAndUpdate({_id: req.params.id}, {
//         $set:
//             {
//                 Username: req.body.Username,
//                 Password: req.body.Password,
//                 Email: req.body.Email
//             }
//         },
//         {new:true})
//     .then((updatedUser) => {
//         res.status(201).json(updatedUser);
//     })
//     .catch((updatedUser) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//     })
// })


// //Add a favourite movie to a user
// app.post('/users/:id/:movieId', async (req,res) => {
//     await users.findOneAndUpdate({ "_id":  req.params.id}, {
//         $push: {FavouriteMovies: req.params.movieId}
//     },
//     {new: true})
//     .then((updatedUser) => {
//         res.status(200).json(updatedUser);
//     })
//     .catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//     })
// })

// //Deletes a favourite movie from a user
// app.delete('/users/:id/:movieId', async (req,res) => {
//     try {
//         const userId = req.params.id;
//         const movieId = req.params.movieId;

//         const updatedUser = await users.findOneAndUpdate(
//             {"_id" : req.params.id},  
//             {$pull: {FavouriteMovies: req.params.movieId}},
//             {new:true}
//         );

//         if (!updatedUser) {
//             return res.status(404).send({message: 'User not found'});        
//         }
//         res.status(200).json(updatedUser)
//     } catch (error) {
//         res.status(500).send({message: 'Error: ' + error});
//     }
// })

app.listen(8080, () => {
    console.log('Listening on port 8080');
})