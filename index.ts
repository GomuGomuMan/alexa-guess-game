import * as Alexa from "alexa-sdk";
import intentHandlers = require('./src/intentHandler');

class Handler {
  constructor(event: Alexa.RequestBody, context: Alexa.Context, callback: Function) {
    let alexa: Alexa.AlexaObject = Alexa.handler(event, context, callback);

    // Temp fix for skill simulator
    event.context.System.application.applicationId = event.session.application.applicationId;
    event.context.System.user.userId = event.session.user.userId;

    alexa.appId = process.env.appId;
    alexa.dynamoDBTableName = process.env.dynamoDBTableName;

    let handlers: Alexa.Handlers = intentHandlers;

    alexa.registerHandlers();
    alexa.execute();
  }
}

export = Handler;
