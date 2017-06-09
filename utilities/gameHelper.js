'use strict';

const math = require('./math.js');
const constants = require('../constants');

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

      // Does not solve the problem of making the distance as long as possible
      // this.attributes['treasure'] = {
      //   x: constants.get('room').WIDTH - this.attributes['player'].x,
      //   y: constants.get('room').LENGTH - this.attributes['player'].y
      // };

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
      this.attributes['traps'] = {
        x: Math.abs(Math.floor((playerX - this.attributes['treasure'].x) / 2)),
        y: Math.abs(Math.floor((playerY - this.attributes['treasure'].y) / 2))
      };
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
