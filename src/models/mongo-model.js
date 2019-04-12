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
    Q.publish('db', 'get', {action:'get', collection:this.schema.modelName,id:_id});
    return this.schema.find(queryObject);
  }
  
  /**
   * post one record to database
   * @param {*} record 
   */
  post(record) {
    let newRecord = new this.schema(record);
    Q.pablish('db', 'create', {action:'create', collection:this.schema.modelName,id:newRecord.id});
    return newRecord.save();
  }

  /**
   * update a record
   * @param {*} _id 
   * @param {*} record 
   */
  put(_id, record) {
    Q.publish('db', 'update', {action:'update', collection:this.schema.modelName,id:_id});
    return this.schema.findByIdAndUpdate(_id, record, {new:true});
  }

  /**
   * delete a record from database
   * @param {*} _id 
   */
  delete(_id) {
    Q.publish('db', 'delete', {action:'delete', collection:this.schema.modelName,id:_id});
    return this.schema.findByIdAndDelete(_id);
  }

}

module.exports = Model;
