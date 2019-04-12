'use strict';

const Model = require('../mongo-model.js');
const schema = require('./teams-schema.js');

/**
 * teams model extends Mongo-model
 */
class Teams extends Model {}

module.exports = new Teams(schema);

