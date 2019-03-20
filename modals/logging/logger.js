const {createLogger, format, transports } = require('winston');
const console = new transports.Console({

});
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),     
    format.colorize(),
    format.simple()
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    console,
    new transports.File({ filename: 'store-app-error.log', level: 'error' }),
    new transports.File({ filename: 'store-app-combined.log' })


  ]
});

if (process.env.NODE_ENV == 'production') {
  logger.remove(console);
}


  module.exports=logger;
