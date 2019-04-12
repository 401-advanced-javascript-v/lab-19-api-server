'use strict';

const uuid = require('uuid/v4');

/**
 * Model for local data memory
 */
class Model {

  /**
   * constructor of schema
   * @param {*} schema 
   */
  constructor(schema) {
    this.schema = schema;
    this.database = [];
  }

  /**
   * data validation checking
   * @param {*} entry 
   */
  sanitize(entry) {

    let valid = true;
    let record = {};

    Object.keys(this.schema).forEach( field => {
      if ( this.schema[field].required ) {
        if (entry[field]) {
          record[field] = entry[field];
        } else {
          valid = false;
        }
      }
      else {
        record[field] = entry[field];
      }
    });
    
    return valid ? record : undefined;
  }
  
  /**
   * count the data number
   */
  count() {
    return this.database.length;
  }

    /**
     * get record depend on id
     * @param {*} id 
     */
  get(id) {
    const records = id ? this.database.filter( (record) => record._id === id ) : this.database;
    return Promise.resolve(records);
  }

  /**
   * post a record to memory data
   * @param {*} entry 
   */
  post(entry) {
    entry._id = uuid();
    let record = this.sanitize(entry);
    if ( record._id ) { this.database.push(record); }
    return Promise.resolve(record);
  }

  /**
   * delete one record
   * @param {*} id 
   */
  delete(id) {
    this.database = this.database.filter((record) => record._id !== id );
    return this.get(id);
  }


  /**
   * updata one record
   * @param {*} id 
   * @param {*} entry 
   */
  put(id, entry) {
    let record = this.sanitize(entry);
    if( record._id ) { this.database = this.database.map((item) => (item._id === id) ? record : item  ); }
    return this.get(id);
  }
  
}

module.exports = Model;