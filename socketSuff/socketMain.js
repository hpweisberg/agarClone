// Purpose: where all of the socket stuff will go

const io = require('../servers').io;

// oh... we need express, get app. but only put express stuff in expressMain.
const app = require('../servers').app;


// module.exports = io;
  // =============CLASSES==============
const Player = require('./classes/Player')
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')
const Orb = require('./classes/Orb');
// ================================



// make an orbs array that will host all 500/5000 orbs NON PLAYER
// every time one is absorbed, the server will make a new one.
const orbs = [];
const settings = {
  defaultNumberOfOrbs: 500, //the number of orbs on the maps.
  defaultSpeed: 6, //player speed
  defaultSize: 6, // default player size
  defaultSize: 1.5, // as the player gets bigger, zoom needs to go out.
  worldWidth: 500,
  worldHeight: 500,
  defaultGenericOrbSize: 5 //smaller than player orbs.
}
const players = [];
let tickTockInterval;

initGame();
// console.log(orbs);

// tick-tock - message EVERY connected socket, that is playing the game, 30 times a second


io.on('connect', (socket) => {
  // a player has connected. 
  socket.on('init', (playerObj, ackCallback) => {

    if(players.length === 0) { //someone is about to be added to players. start tick-tocking

      tickTockInterval = setInterval(() => {
        io.to('game').emit('tick', players); // send the event to the "game" room.
      }, 33) // 1000/30=33.333333, there are 33, 30's in 1000 milliseconds, 1/30th of a second, or 1 of 30 fps.
    }

    socket.join('game'); //add this socket to the game room.
    // event that runs on join that does init game stuff
    // console.log('a user connected');
    // make a playerConfig opbject - this data specfic obj that only the palyer that needs to know.
    
    const playerName = playerObj.playerName;
    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerName, settings);
    const player = new Player(socket.id, playerConfig, playerData);
    players.push(player)
    // make a playerData obj. - the data specific to this player that EVERYONE needs to know
    // a master player object to house both.
    ackCallback(orbs) //send the orbs array back as 
  })
  socket.on('disconnect', () => {
    // check to see if players is empty. if so, stom 'ticking'
    if(players.length === 0) {
        clearInterval(tickTockInterval)
      }
    })
});

// on server start, make our initial 500.
function initGame() {
  for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
    // io.emit('orbSwitch', new Orb(makeid(6), makeid(6), makeid(6)));
    orbs.push(new Orb(settings));
  }
}