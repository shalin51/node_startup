const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const DB=require('./db/db');

// const address = require('./routes/addressRoute');
const logger = require('./modals/Logging/Logger');
require('dotenv').config();

const mongoStore = new MongoDBStore({
    uri: DB.connectionString,
    collection: 'store_sessions'
  });
   
  // Catch errors
  mongoStore.on('error', function(error) {
    console.log(error);
  });
   
  app.use(require('express-session')({
    secret: process.env.cookie_secret, 
    cookie: {
      maxAge: 1000 * 60 * 60  // 1 week
    },
    mongoStore,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: false,
    saveUninitialized: false
  }));
   
app.use(cors());
app.use(bodyParser.json({ limit: '15mb', extended: true }));
app.use(cookieParser())
app.use(helmet());

//app.use('/api/v1/store', stores);


app.listen(process.env.app_port, () => {
    logger.info('store app server is running at ' + process.env.app_port);
    console.log('store app server is running at ' + process.env.app_port);
}

)