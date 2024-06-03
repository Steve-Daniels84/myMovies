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
}

async function getUserById (req, res) {
    await Users.find({'_id': req.params.id})
    .then( user => {
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(400).send('Error: ' + err);
    })
}

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
}

module.exports = {
    listUsers, getUserById, addUser
}
