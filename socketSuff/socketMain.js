// Purpose: where all of the socket stuff will go

const io = require('../servers').io;

// oh... we need express, get app. but only put express stuff in expressMain.
const app = require('../servers').app;
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions

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
const playersForUsers = [];

let tickTockInterval;

initGame();
// console.log(orbs);

// tick-tock - message EVERY connected socket, that is playing the game, 30 times a second


io.on('connect', (socket) => {
  // a player has connected. 
  let player = {};
  socket.on('init', (playerObj, ackCallback) => {

    if(players.length === 0) { //someone is about to be added to players. start tick-tocking

      tickTockInterval = setInterval(() => {
        io.to('game').emit('tick', playersForUsers); // send the event to the "game" room.
      }, 33) // 1000/30=33.333333, there are 33, 30's in 1000 milliseconds, 1/30th of a second, or 1 of 30 fps.
    }

    socket.join('game'); //add this socket to the game room.
    // event that runs on join that does init game stuff
    // console.log('a user connected');
    // make a playerConfig opbject - this data specfic obj that only the palyer that needs to know.
    
    const playerName = playerObj.playerName;
    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);
    players.push(player) // server use only
    playersForUsers.push({playerData})
    // make a playerData obj. - the data specific to this player that EVERYONE needs to know
    // a master player object to house both.
    ackCallback({orbs, indexInPlayers: playersForUsers.length - 1}) //send the orbs array back as 
  })

  // the client set over a 'tock'
  socket.on('tock', (data) => {
    // a tock has come in before the player is set up.
    // this is because the client kept tocking after disconnect
    if (!player.playerConfig) return
    speed = player.playerConfig.speed
    const xV = player.playerConfig.xVector = data.xVector;
    const yV = player.playerConfig.yVector = data.yVector;

    // if player can move un the x, move
    if((player.playerData.locX > 5 && xV < 0) || (player.playerData.locX < settings.worldWidth) && (xV > 0)){
      player.playerData.locX += speed * xV;
      // if player can move un the y, move
    } if((player.playerData.locY > 5 && yV > 0) || (player.playerData.locY < settings.worldHeight) && (yV < 0)){
        player.playerData.locY -= speed * yV;
    }
    
    // check for the tocking player to hit orbs
    const capturedOrbI = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings)
    // function returns null if no collision, an index if there is a collision
    if(capturedOrbI != null) {
      // removed the orb that needs to be replacd at capturedOrbI
      // add a new orb
      orbs.splice(capturedOrbI, 1, new Orb(settings))
      // now update the clients with a new orb
      const orbData = {
        capturedOrbI,
        newOrb: orbs[capturedOrbI],
      }
      // emit to all sockets playing the game, the orbSwitch event so it can update orbs... just the new orb
      io.to('game').emit('orbSwitch', orbData);
    }

    const absorbedData = checkForPlayerCollisions(player.playerData, player.playerConfig, players, playersForUsers)
    if (absorbedData) {
      io.to('game').emit('playerAbsorbed', absorbedData)
    }
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