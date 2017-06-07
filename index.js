const Alexa = require('alexa-sdk');
const constants = require('./constants');

exports.handler = (event, context, callback) => {
  var alexa = Alexa.handler(event, context);
  alexa.appId = constants.get('appId');
  alexa.dynamoDBTableName = constants.get('dynamoDBTableName');

  alexa.registerHandlers(intentHandlers);
  alexa.execute();
}

var intentHandlers = {
  'LaunchRequest': function () {
    var prompt = 'Welcome to maze, Find a treasure and win the game, '
      + 'Move around by saying, Go north, west, east, south';
    var reprompt = 'Move around by saying Go north, west, east, south';

    initializeDb.call(this);
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


    var obstacles = moveDirection.call(this);

    this.emit(':saveState', true);

    var prompt;
    var reprompt;

    if (obstacles.isWall) {
      prompt = 'That is a wall, You can not proceeed Where would you like to go?';
      reprompt = 'Where would you like to go next?';
      this.emit(':ask', prompt, reprompt);
    }
    else if (obstacles.isTrap) {
      var deathScenario = getDeath.call(this);
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

function initializeDb() {
  // TODO: Generate traps randomly



  // TODO: Create traps static for demo
  this.attributes['traps'] = {
    x: 1,
    y: 1
  };

  //TODO: Create sword static for demo
  this.attributes['sword'] = {
    x: 0,
    y: 2
  }

  this.attributes['player'] = {
    x: getRandInRange(0, constants.get('room').WIDTH - 1),
    y: getRandInRange(0, constants.get('room').LENGTH - 1),
    hasSword: false
  }

  this.attributes['treasure'] = {
    x: constants.get('room').WIDTH - this.attributes['player'].x,
    y: constants.get('room').LENGTH - this.attributes['player'].y
  };
}

function moveDirection() {
  var isWall = false;
  var direction = this.event.request.intent.slots.Direction.value.toLowerCase();

  switch (direction) {
    case 'north':
      if (this.attributes['player'].y === 0)
        isWall = true;
      else
        --this.attributes['player'].y;
      break;

    case 'west':
      if (this.attributes['player'].x === 0)
        isWall = true;
      else
        --this.attributes['player'].x;
      break;

    case 'east':
      if (this.attributes['player'].x === constants.get('room').WIDTH - 1)
        isWall = true;
      else
        ++this.attributes['player'].x;
      break;

    case 'south':
      if (this.attributes['player'].y === constants.get('room').LENGTH - 1)
        isWall = true;
      else
        ++this.attributes['player'].y;
      break;

    default:
      break;
  }

  var isTrap = checkTrap.call(this);
  var isSword = checkSword.call(this);
  var isSwordInDistant = checkSwordInDistant.call(this);

  return {
    isWall,
    isTrap,
    isSword,
    isSwordInDistant
  };
}

function checkSwordInDistant() {
  if (this.attributes['player'].hasSword)
    return false;
  else if (this.attributes['player'].x === this.attributes['sword'].x
    || this.attributes['player'].y === this.attributes['sword'].y) {

    return true;
  }
  return false;
}

function checkSword() {
  if (this.attributes['player'].x === this.attributes['sword'].x
    && this.attributes['player'].y === this.attributes['sword'].y) {

    return true;
  }
  return false;
}

function checkTrap() {
  if (this.attributes['player'].x === this.attributes['traps'].x
    && this.attributes['player'].y === this.attributes['traps'].y) {

    return true;
  }
  return false;
}

function getDeath() {
  var deathScenario = [
    "You fall into a lava trap, You are incenerated thoroughly ",
    "You encounter a troll, Your head is suddenly bashed away ",
    "You step on an egg, Before you could react, an emu mother pecks your head, You die instantly ",
    "You are trampled by a huge boulder that appears out of nowhere "
  ];
  var randomIdx = getRandInRange(0, deathScenario.length - 1);
  if (this.attributes['player'].hasSword && (randomIdx === 1 || randomIdx === 2)) {
    return null;
  }

  return deathScenario[randomIdx];
}

function getRandInRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
