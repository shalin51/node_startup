const DB = require('../db/db');
const UserException = require('./exception/userException');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const collection = 'stores';


class User{
    constructor(email){
     this._id=email;
     this.email=email;    
     this.firstName='';
     this.lastName='';
     this.phone='';         
    }

    async addUser(user,pass){
        try {   
            pass= await bcrypt.hash(pass, saltRounds);
            user={
                ...user,
                pass
            } 
            let db = new DB(collection);
            let id=await db.insertOne(user);           
            return id;
        } catch (err) {
            throw new UserException(err);
        }
    }

    async getUserOne(){
        try { 
            if(await validate(user))  {
                let _id=this._id;      
                let query={_id};
                let db = new DB(collection);
                let user= db.findOne(query)
                return user;
            }           
        } catch (err) {
            throw new UserException(err);
        }
    }  

    async getUsers(query={}){
        try {         
            let db = new DB(collection);
            let user= db.find(query)
            return user;
        } catch (err) {
            throw new UserException(err);
        }
    }

    async updateUser(update){
        try {
            let db = new DB(collection);
            let _id=this._id;
            query={_id};            
            await db.update(query,update);
        } catch (err) {
            throw new UserException(err);
        }
    }

    async updateUserActivity(activity){
        try {
            let db = new DB(collection);
            let _id=this._id;
            query={_id};         
            let update={
                '$push':{activities:{
                    aDate:formatDateTime(new Date()),
                    activity
                }}
            };            
            await db.update(query,update);
        } catch (err) {
            throw new UserException(err);
        }
    }
    
    async validate(pass){
        try {
            let db=new DB(collection);            
            let query={
               email:this.email
            }                      
            const {pass:hash}=await db.findOne(query,{pass:1});         
            let is_valid=await bcrypt.compare(pass, hash);
            return is_valid;
        } catch (err) {            
            throw {err,method:'validate user'};
        }
    }


}

module.exports = User;
