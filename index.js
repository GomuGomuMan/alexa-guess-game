const Alexa = require('alexa-sdk');
const constants = require('./constants');
const intentHandlers = require('./intents');

exports.handler = (event, context, callback) => {
  var alexa = Alexa.handler(event, context);
  // alexa.appId = constants.get('appId');
  alexa.appId = process.env.appId;
  alexa.dynamoDBTableName = process.env.dynamoDBTableName;

  alexa.registerHandlers(intentHandlers); //intentHandlers
  alexa.execute();
}
