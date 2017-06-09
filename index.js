const Alexa = require('alexa-sdk');
const constants = require('./constants');
const intentHandlers = require('./intents');

exports.handler = (event, context, callback) => {
  var alexa = Alexa.handler(event, context);
  alexa.appId = constants.get('appId');
  alexa.dynamoDBTableName = constants.get('dynamoDBTableName');

  alexa.registerHandlers(intentHandlers); //intentHandlers
  alexa.execute();
}
