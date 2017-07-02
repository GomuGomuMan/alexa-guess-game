const { Map } = require('immutable');

const constants = Map({
  room: {
    WIDTH: 6,
    LENGTH: 6
  },

  trap: [
    {
      type: 'trap',
      element: 'fire',
      deathText: "You fall into a lava trap, You are incenerated thoroughly ",
      warningText: ''
    },
    {
      type: 'trap',
      element: 'beast',
      deathText: "You encounter a troll, Your head is suddenly bashed away ",
      warningText: ''
    },
    {
      type: 'trap',
      element: 'beast',
      deathText: "You step on an egg, Before you could react, an emu mother pecks your head, You die instantly ",
      warningText: ''
    },
    {
      type: 'trap',
      element: 'ground',
      deathText: "You are trampled by a huge boulder that appears out of nowhere ",
      warningText: ''
    }
  ],

});

module.exports = constants;
