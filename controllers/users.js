const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myMovies', {useNewUrlParser: true, useUnifiedTopology: true});

const Models = require('../models/models.js');

let Users = Models.User;

async function listUsers (req, res) {
   await Users.find()
   .then (users => {
        res.status(200).json(users);
   })
   .catch(err => {
    res.status(400).send('Error: ' + err);
   })
};

async function getUserById (req, res) {
    await Users.find({'_id': req.params.id})
    .then( user => {
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(400).send('Error: ' + err);
    })
};

async function addUser (req, res) {
    await Users.findOne({Username: req.body.Username})
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
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
};

async function deleteUser (req, res) {
    const userId = req.params.id;
    await Users.findOneAndDelete({ _id: req.params.id})
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
};

async function addMovie (req, res) {
    await Users.findOneAndUpdate({ "_id":  req.params.id}, {
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
}

async function deleteMovie (req,res) {
        try {
        const userId = req.params.id;
        const movieId = req.params.movieId;

        const updatedUser = await Users.findOneAndUpdate(
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
}

module.exports = {
    listUsers, getUserById, addUser, deleteUser, addMovie, deleteMovie
}
