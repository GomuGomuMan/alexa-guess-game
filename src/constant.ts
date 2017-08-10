export interface Prompts {
  [intentName: string]: Prompt;
};

export interface Prompt {
  prompt: string;
  reprompt?: string;
};

export  class Constant {
  private readonly _prompt: Prompts = {
    LaunchRequest: {
      prompt: "Welcome to Maze. Find a treasure and win the game. Move around by saying: \"Go north, west, east, or south\"",
      reprompt: "Move around by saying: \"Go north, west, east, or south\""
    },

    'AMAZON.HelpIntent': {
      prompt: "Welcome to Maze. Find a treasure and win the game. Move around by saying: \"Go north, west, east, or south\"",
      reprompt: "Move around by saying: \"Go north, west, east, or south\""
    },

    'AMAZON.StopIntent': {
      prompt: "Your adventure finished"
    },

    'AMAZON.CancelIntent': {
      prompt: "Your adventure finished"
    },

    'playerPosIntent': {
      prompt: "",
      reprompt: ""
    }

  };

  get prompt(): Prompts {
    return this._prompt;
  }

};
