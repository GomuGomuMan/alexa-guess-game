import * as Alexa from "alexa-sdk";
import * as constants from "./constant";

let constant: constants.Constant = new constants.Constant();

let prompt: string;
let reprompt: string | undefined;

const handler: Alexa.Handlers = {
  LaunchRequest: function(): void {
    prompt = constant.prompt.LaunchRequest.prompt;
    reprompt = constant.prompt.LaunchRequest.reprompt;
    this.emit(':ask', prompt, reprompt);
  },

  'AMAZON.HelpIntent': function() {

  },

  'AMAZON.StopIntent': function() {

  },

  'AMAZON.CancelIntent': function() {

  },

  playerPosIntent: function() {

  },

  treasurePosIntent: function() {

  },

  buildWorldIntent: function() {

  },

  moveIntent: function() {

  },

  Unhandled: function() {

  },

  SessionEndedRequest: function() {

  }
}

export = handler;
