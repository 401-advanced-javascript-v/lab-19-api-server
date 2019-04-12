'use strict';

const Model = require('../mongo-model.js');
const schema = require('./players-schema.js');

/**
 * players model extends Mongo model
 */
class Players extends Model {}

module.exports = new Players(schema);

