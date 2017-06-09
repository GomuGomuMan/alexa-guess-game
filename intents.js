'use strict';

const gameUtilities = require('./utilities/gameHelper');

const intentHandlers = {
  'LaunchRequest': function () {
    var prompt = 'Welcome to maze, Find a treasure and win the game, '
      + 'Move around by saying, Go north, west, east, south';
    var reprompt = 'Move around by saying Go north, west, east, south';

    gameUtilities.initializeDb.call(this);
    this.emit(':ask', prompt, reprompt);
  },

  'AMAZON.HelpIntent': function() {
    var prompt = 'Welcome to maze, Find a treasure and win the game, '
      + 'Move around by saying Go north, west, east, south';
    var reprompt = 'Move around by saying Go north, west, east, south';
    this.emit(':ask', prompt, reprompt);
  },

  'AMAZON.StopIntent': function() {
    var prompt = 'Your adventure finished';
    this.emit(':tell', prompt);
  },

  'AMAZON.CancelIntent': function() {
    var prompt = 'Your adventure finished';
    this.emit(':tell', prompt);
  },

  'playerPosIntent': function() {
    var prompt = `You are currently in grid ${this.attributes['player'].x} ${this.attributes['player'].y} `
      + 'Where would you like to go next';
    var reprompt = `Where would you like to go next`;
    this.emit(':ask', prompt, reprompt);
  },

  'treasurePosIntent': function() {
    var prompt = `Treasure is in in grid ${this.attributes['treasure'].x} ${this.attributes['treasure'].y} `
      + 'Where would you like to go next';
    var reprompt = `Where would you like to go next`;
    this.emit(':ask', prompt, reprompt);
  },

  'buildWorldIntent': function() {
    var width = this.event.request.intent.slots.Width.value;
    var length = this.event.request.intent.slots.Length.value;

    this.attributes['worldWidth'] = width;
    this.attributes['worldLength'] = length;
  },

  'moveIntent': function() {
    var direction = this.event.request.intent.slots.Direction.value.toLowerCase();
    console.log(`direction: ${JSON.stringify(direction)}`);
    console.log(`direction: ${JSON.stringify(this.attributes)}`);


    var obstacles = gameUtilities.moveDirection.call(this);

    this.emit(':saveState', true);

    var prompt;
    var reprompt;

    if (obstacles.isWall) {
      prompt = 'That is a wall, You can not proceeed Where would you like to go?';
      reprompt = 'Where would you like to go next?';
      this.emit(':ask', prompt, reprompt);
    }
    else if (obstacles.isTrap) {
      var deathScenario = gameUtilities.getDeath.call(this);
      if (!deathScenario) {
        prompt = 'You possess the sword and you kill the beast, You live this time '
          + 'Where would you like to go next?';
        reprompt = 'Where would you like to go next?';
        this.emit(':ask', prompt, reprompt);
      }
      else {
        prompt = deathScenario + ', Try again next time!';
        this.emit(':tell', prompt);
      }
    }
    else if (obstacles.isSword) {
      prompt = 'You have found a sword, Where would you like to go next? ';
      reprompt = 'Where would you like to go next?';
      this.attributes['player'].hasSword = true;
      this.emit(':ask', prompt, reprompt);
    }
    else if (this.attributes['player'].x === this.attributes['treasure'].x
      && this.attributes['player'].y === this.attributes['treasure'].y) {

      prompt = 'You have reach the treasure, Congratulations';
      this.emit(':tell', prompt);
    }
    else {
      var swordInDistantPrompt = '';
      if (obstacles.isSwordInDistant)
        swordInDistantPrompt = 'There is something shiny in the distant ';

      prompt = `You are currently in grid ${this.attributes['player'].x} ${this.attributes['player'].y} `
        + swordInDistantPrompt
        + 'Where would you like to go next?';
      reprompt = 'Where would you like to go?';
      this.emit(':ask', prompt, reprompt);
    }
  },

  'Unhandled': function() {
    var prompt = 'Sorry, I did not understand that, please try to say again';
    var reprompt = 'Can you repeat that?';
  }
}

module.exports = intentHandlers;
