const Exception=require('./exception');

class UserException extends Exception{
    constructor(message,fileName='', lineNumber=''){
        super('User',message,fileName='', lineNumber='')
    }
}

module.exports=UserException;
