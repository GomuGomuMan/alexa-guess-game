'use strict';

const math = require('./math');
const constants = require('../constants');
const utilities = require('./utility');

const gameHelper = function() {
  return {
    initializeDb: function() {

      //TODO: Randomly generate position for sword
      this.attributes['sword'] = {
        x: 0,
        y: 2
      };

      this.attributes['player'] = {
        x: math.getRandInRange(0, constants.get('room').WIDTH - 1),
        y: math.getRandInRange(0, constants.get('room').LENGTH - 1),
        hasSword: false
      };

      // Edge case:
      var halfWidth = Math.floor(constants.get('room').WIDTH / 2);
      var halfLength = Math.floor(constants.get('room').LENGTH / 2);
      var playerX = this.attributes['player'].x;
      var playerY = this.attributes['player'].y;

      this.attributes['treasure'] = {
        x: Math.abs(playerX - halfLength),
        y: Math.abs(playerY - halfWidth)
      };

      // TODO: How to generate more traps that make sense?
      this.attributes['map'] = gameHelper.generateInitialMap();

      var trapCoords = gameHelper.generateTrapsLoc.call(this);
      gameHelper.populateTraps.call(this, trapCoords);
    },

    populateTraps: function(trapCoords) {
      var traps = utilities.shuffleArray(constants.get('trap'));
      trapCoords.forEach((coords, index) => {
        this.attributes['map'][coords.x][coords.y] = traps[index];
      });
      return;
    },

    generateInitialMap: function() {
      var map = [];
      for (var i = 0; i < constants.get('room').WIDTH; ++i) {
        var row = [];
        for (var j = 0; j < constants.get('room').LENGTH; ++j) {
          row.push({});
        }
        map.push(row);
      }

      return map;
    },

    generateTrapsLoc: function() {
      const treasure = this.attributes['treasure'];
      const roomWidth = constants.get('room').WIDTH;
      const roomLength = constants.get('room').LENGTH;
      const halfWidth = Math.floor(roomWidth / 2);
      const halfLength = Math.floor(roomLength / 2);

      var traps = [];
      var trap1 = {},
        trap2 = {},
        trap3 = {};
      //TODO: Generate traps in 3 other subfields

      trap1.y = math.getRandInRange(0, halfLength - 1);

      trap2.y = math.getRandInRange(halfLength, roomLength - 1);

      trap3.y = treasure.y < halfLength
        ? math.getRandInRange(halfLength, roomLength - 1)
        : math.getRandInRange(0, halfLength - 1);

      if (treasure.x < halfWidth) {
        trap1.x = math.getRandInRange(halfWidth, roomWidth - 1);
        trap2.x = math.getRandInRange(halfWidth, roomWidth - 1);
        trap3.x = math.getRandInRange(0, halfWidth - 1);
      }
      else {
        trap1.x = math.getRandInRange(0, halfWidth - 1);
        trap2.x = math.getRandInRange(0, halfWidth - 1);
        trap3.x = math.getRandInRange(halfWidth, roomWidth - 1);
      }

      traps.push(trap1);
      traps.push(trap2);
      traps.push(trap3);

      return traps;
    },

    moveDirection: function() {
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

      var isTrap = gameHelper.checkTrap.call(this);
      var isSword = gameHelper.checkSword.call(this);
      var isSwordInDistant = gameHelper.checkSwordInDistant.call(this);

      return {
        isWall,
        isTrap,
        isSword,
        isSwordInDistant
      };
    },

    checkSwordInDistant: function() {
      if (this.attributes['player'].hasSword)
        return false;
      else if (this.attributes['player'].x === this.attributes['sword'].x
        || this.attributes['player'].y === this.attributes['sword'].y) {

        return true;
      }
      return false;
    },

    checkSword: function() {
      if (this.attributes['player'].x === this.attributes['sword'].x
        && this.attributes['player'].y === this.attributes['sword'].y) {

        return true;
      }
      return false;
    },

    checkTrap: function() {
      if (this.attributes['player'].x === this.attributes['traps'].x
        && this.attributes['player'].y === this.attributes['traps'].y) {

        return true;
      }
      return false;
    },

    getDeath: function() {
      var deathScenario = [
        "You fall into a lava trap, You are incenerated thoroughly ",
        "You encounter a troll, Your head is suddenly bashed away ",
        "You step on an egg, Before you could react, an emu mother pecks your head, You die instantly ",
        "You are trampled by a huge boulder that appears out of nowhere "
      ];
      var randomIdx = math.getRandInRange(0, deathScenario.length - 1);
      if (this.attributes['player'].hasSword && (randomIdx === 1 || randomIdx === 2)) {
        return null;
      }

      return deathScenario[randomIdx];
    }

  };
}();

module.exports = gameHelper;
