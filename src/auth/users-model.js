'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('./roles-model.js');

const SINGLE_USE_TOKENS = !!process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '5m';
const SECRET = process.env.SECRET || 'foobar';

const usedTokens = new Set();


/**
 * User schema
 */
const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  role: {type: String, default:'user', enum: ['admin','editor','user','superuser']},
}, { toObject:{virtuals:true}, toJSON:{virtuals:true}});

/**
 * create virtual field in userschema with matching roles
 */
users.virtual('roles', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'role',
  justOne:true,
});

const capabilities = {
  admin: ['create','read','update','delete'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

/**
 * before finding anything poplate role
 */
users.pre('find'), function() {
  try {
    this.populate('role');
  }
  catch(e) {
    console.error('Find Error', e);
  }
}


/**
 * before save to database hash the password
 */
users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => {throw new Error(error);});
});


/**
 * Find user or if it's not exist create one 
 */
users.statics.createFromOauth = function(email) {

  if(! email) { return Promise.reject('Validation Error'); }

  return this.findOne( {email} )
    .then(user => {
      if( !user ) { throw new Error('User Not Found'); }
      return user;
    })
    .catch( error => {
      let username = email;
      let password = 'none';
      return this.create({username, password, email});
    });

};

/**
 * create a token with jwt, find user by id
 */
users.statics.authenticateToken = function(token) {
  
  if ( usedTokens.has(token ) ) {
    return Promise.reject('Invalid Token');
  }
  
  try {
    let parsedToken = jwt.verify(token, SECRET);
    (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);
    let query = {_id: parsedToken.id};
    return this.findOne(query);
  } catch(e) { throw new Error('Invalid Token'); }
  
};

/**
 * 
 */
users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};

/**
 * compare password
 */
users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

/**
 * generate a token
 */
users.methods.generateToken = function(type) {
  
  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
    type: type || 'user',
  };
  
  let options = {};
  if ( type !== 'key' && !! TOKEN_EXPIRE ) { 
    options = { expiresIn: TOKEN_EXPIRE };
  }
  
  return jwt.sign(token, SECRET, options);
};

/**
 * give the role its capability
 */
users.methods.can = function(capability) {
  console.log(capability);
  return capabilities[this.role].includes(capability);
};

users.methods.generateKey = function() {
  return this.generateToken('key');
};

module.exports = mongoose.model('users', users);
