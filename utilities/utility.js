'use strict';

const math = require('./math');

const utilities = function() {
  return {
    shuffleArray: function (arr) {
      var result = arr;
      var freeLen = result.length - 1;
      while (freeLen >= 0) {
        var idx = math.getRandInRange(0, freeLen);
        result = utilities.swap(result, idx, freeLen);
        --freeLen;
      }
      return result;
    },

    swap: function (arr, idx1, idx2) {
      var temp = arr[idx1];
      arr[idx1] = arr[idx2];
      arr[idx2] = temp;
      return arr;
    }
  };
}();

module.exports = utilities;
