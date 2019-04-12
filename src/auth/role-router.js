'use strict';

const express = require('express');
const roleRouter = express.Router();

const auth = require('./middleware.js');
const Role = require('./roles-model.js');

roleRouter.post('/roles', (req,res,next) => {
    let role = new Role(req.body);
    role.save();
    res.status(200).send('Saved a new role to the db');
  });


roleRouter.get('/public-stuff', (req,res,next) => {
    res.status(200).send('Welcome to the public-stuff that everybody can see it');
  })

roleRouter.get('/hidden-stuff', auth(), (req,res,next) => {
    res.status(200).send('Welcome to the hidden-stuff that only can read after log-in');
  })

  roleRouter.get('/something-to-read', auth('read'), (req,res,next) => {
    res.status(200).send('Welcome to get something to read');
  })

  roleRouter.post('/create-a-thing', auth('create'), (req,res,next) => {
    res.status(200).send('Welcome to create a thing as an editor');
  })

  roleRouter.put('/update', auth('update'), (req,res,next) => {
    res.status(200).send('Welcome to update the newest comment');
  })

  roleRouter.patch('/jp', auth('update'), (req,res,next) => {
    res.status(200).send('Welcome to patch whatever you like');
  })

  roleRouter.delete('/bye-bye', auth('delete'), (req,res,next) => {
    res.status(200).send('Delete the thing you don\'t want it');
  })

  roleRouter.get('/everything', auth('superuser'), (req,res,next) => {
    res.status(200).send('Welcome as a superuser');
  })



module.exports = roleRouter;