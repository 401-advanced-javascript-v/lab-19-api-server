'use strict';

const mongoose = require('mongoose');


/**
 * Mongodb schema
 */
const rolesSchema = new mongoose.Schema({
  role: {type: String, required:true},
  capabilities: {type: Array, required:true},
});

module.exports = mongoose.model('roles', rolesSchema);
