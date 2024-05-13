const socket = io.connect('http://localhost:9000');

const init = async () => {
    // initialize is called inside of start-game click listener
    const initData = await socket.emitWithAck('init', {
        playerName: player.name,
    })
    // our await has resolved, so start 'tocking'
    setInterval(async() => {
        socket.emit('tock', {
            xVector: player.xVector ? player.xVector : .1,
            yVector: player.yVector ? player.yVector : .1,
        })
    }, 33)
    // console.log(initData.orbs);
    orbs = initData.orbs;
    player.indexInPlayers = initData.indexInPlayers;
    draw(); // from canvasStuff.
}



// the server sends out the location/data of all players 30/second
socket.on('tick', (playersArray) => {
    // console.log(players)
    players = playersArray
    player.locX = players[player.indexInPlayers].playerData.locX
    player.locY = players[player.indexInPlayers].playerData.locY
})

socket.on('orbSwitch', (orbData) => {
    // the server just told us that an orb was absorbed. Replace it in the orbs array!
    orbs.splice(orbData.capturedOrbI, 1, orbData.newOrb);
})

socket.on('playerAbsorbed', absorbedData => {
    console.log('=======')
    console.log(`player who was abosrbed ${absorbedData.absorbed}`)
    console.log(`player who did the abosrbing ${absorbedData.abosrbedBy}`)
    
})