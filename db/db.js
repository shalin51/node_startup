const MongoClient = require("mongodb").MongoClient;
const DBException = require("../modals/exception/dbException");
const { ObjectID } = require("mongodb");
require('dotenv').config();
const { db_host, db_port, db_user, db_pass, db_name } = process.env;    
// const _connectionString = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`;
const _connectionString = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`;
class DB {

  constructor(collectionName){
    this.collectionName=collectionName;
  }
  static get connectionString() { return _connectionString };
  get connectionString(){ return _connectionString};

  async get_connection() {
    try {
      let client = await MongoClient.connect(
        this.connectionString,
        { useNewUrlParser: true }
      );
      let db = client.db();
      let collection = db.collection(this.collectionName);
      return collection;
    } catch (err) {
      throw new DBException(err);
    }
  }

  async find(query ) {
    try {     
      let conn = await this.get_connection();
      let data = await conn.find(query);
      data = await data.toArray();
      return data;
    } catch(err) {
      if (conn.isConnected()) conn.close();
      throw new DBException(err);
    }
  }

  async findOne(query) {
    try {
      // if (query._id) {
      //   let _id = ObjectID(query._id);
      //   query = {
      //     ...query,
      //     _id
      //   };
      // }
      let conn = await this.get_connection();
      return await conn.findOne(query);
    } catch (err) {
      if (conn.isConnected()) conn.close();
      throw new DBException(err);
    }
  }

  async insertOne(doc) {
    try {
      let conn = await this.get_connection();
      let data = await conn.insertOne(doc);
      let id = data.insertedId
      return id;
    } catch(err) {
      if (conn.isConnected()) conn.close();
      throw new DBException(err);
    }
  }

  async insertMany(docs) {
    try {
      let conn = await this.get_connection();
      return await conn.insertMany(docs);
    } catch (err){
      if (conn.isConnected()) conn.close();
      throw new DBException(err);
    }
  }

  async update(query, update, updateOptions) {
    try {
      if (query._id) {
        let _id = ObjectID(query._id);
        query = {
          ...query,
          _id
        };
      }
      let conn = await this.get_connection();
      return await conn.updateOne(query, update, updateOptions);
    } catch (err){
      if (conn.isConnected()) conn.close();
      throw new DBException(err);
    }
  }
}

module.exports = DB;
