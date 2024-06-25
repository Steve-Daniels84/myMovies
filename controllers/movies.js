require('dotenv').config();
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/myMovies', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const Models = require('../models/models.js');

let Movies = Models.Movie;

async function listAllMovies (req, res) {
    await Movies.find()
    .then (movies => {
        res.status(200).json(movies);
    })
    .catch (err => {
        res.status(400).send('Error: ' + err);
    });
};

async function getMoviesByGenre (req, res) {
    await Movies.find({"Genre.Name": req.params.Genre})
    .then((movie) => {
        res.status(200).json(movie)
    })
    .catch ((err) => res.status(400).send('Error: ' + err));
};

async function getMovieByTitle (req, res) {
    await Movies.findOne({Title: req.params.Title})
    .then((movie) => {
        res.status(200).json(movie)
    })
    .catch ((err) => res.status(400).send('Error: ' + err));
};

async function addMovie (req, res) {
    await Movies.findOne({Title: req.body.Title})
    .then((movie) => {
        if (movie) {
            res.status(400).send('Movie already exists')
        } else {
                    Movies.create({
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
    };

    async function updateGenreByMovieTitle (req, res) {
        try {
            const updatedMovie = await Movies.findOneAndUpdate(
                { Title: req.params.Title },
                {
                    $set: {
                        "Genre.Name": req.body.Name,
                        "Genre.Description": req.body.Description
                    }
                },
                { new: true }
            );
            if (updatedMovie) {
                res.status(200).send('Genre details updated');
            } else {
                res.status(404).send('Movie not found');
            }
        } catch (err) {
            res.status(400).send('Error: ' + err);
        }
    }
    
    async function deleteMovieById (req, res) {
        const movieId = req.params.id;
    await Movies.findOneAndDelete({ _id: req.params.id})
    .then((movies) => {
        if (!movies) {
            res.status(400).send('Movie ' + movieId + ' was not found');
        } else {
            res.status(200).send('movie ' + movieId + ' was deleted');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
    };

module.exports = {
    listAllMovies, getMovieByTitle, addMovie, updateGenreByMovieTitle, deleteMovieById, getMoviesByGenre
}
