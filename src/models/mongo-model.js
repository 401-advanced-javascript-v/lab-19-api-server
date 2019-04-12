'use strict';
/**
 * Mongo Model
 */
class Model {

  /**
   * schema for mongo db
   * @param {*} schema 
   */
  constructor(schema) {
    this.schema = schema;
  }

  /**
   * Get one rocord depend on id
   * @param {*} _id 
   */
  get(_id) {
    let queryObject = _id ? {_id} : {};
    return this.schema.find(queryObject);
  }
  
  /**
   * post one record to database
   * @param {*} record 
   */
  post(record) {
    let newRecord = new this.schema(record);
    return newRecord.save();
  }

  /**
   * update a record
   * @param {*} _id 
   * @param {*} record 
   */
  put(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, {new:true});
  }

  /**
   * delete a record from database
   * @param {*} _id 
   */
  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }

}

module.exports = Model;
