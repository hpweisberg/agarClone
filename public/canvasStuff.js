// const init = () => {
//   console.log(orbs)
//   draw();
// }

player.locX = Math.floor(500 * Math.random() + 10) // horizontal axis
player.locY = Math.floor(500 * Math.random() + 10) // vertical Axis


// =====================
// =======DRAW==========
// =====================
const draw = () => {
  // reset the context translate back to default.
  context.setTransform(1, 0, 0, 1, 0, 0);
  // clears out the canvas, so we can draw on a clean canvas next frame/draw
  context.clearRect(0, 0, canvas.width, canvas.height);

  // clamp the screen to the players location
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;
  // translate moves the canvas/context to where the player is at.
  context.translate(camX, camY);


  context.beginPath()
  context.fillStyle = 'rgb(255,0,0)'
  context.arc(player.locX, player.locY, 10, 0, 2 * Math.PI)
  context.arc(200, 200, 10, 0, 2 * Math.PI)
  context.fill()
  context.lineWidth = 3
  context.strokeStyle = 'rgb(0, 255, 0)'
  context.stroke()
  
  orbs.forEach(orb => {
    context.beginPath()
    context.fillStyle = orb.color
    context.arc(orb.locX, orb.locY, 10, 0, 2 * Math.PI)
    context.fill()
  })

  requestAnimationFrame(draw); // like a controled loop it runs recursively, every paint/frame. if the framerate is 35fps.
}

canvas.addEventListener('mousemove',(event)=>{
  // console.log(event)
  const mousePosition = {
      x: event.clientX,
      y: event.clientY
  };
  const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
  if(angleDeg >= 0 && angleDeg < 90){
      xVector = 1 - (angleDeg/90);
      yVector = -(angleDeg/90);
      console.log("mouse is in the lower right")
    }else if(angleDeg >= 90 && angleDeg <= 180){
      xVector = -(angleDeg-90)/90;
      yVector = -(1 - ((angleDeg-90)/90));
      console.log("mouse is in the lower left")
    }else if(angleDeg >= -180 && angleDeg < -90){
      xVector = (angleDeg+90)/90;
      yVector = (1 + ((angleDeg+90)/90));
      console.log("mouse is in the upper left")
    }else if(angleDeg < 0 && angleDeg >= -90){
      xVector = (angleDeg+90)/90;
      yVector = (1 - ((angleDeg+90)/90));
      console.log("mouse is in the upper right")
  }

  speed = 10
  xV = xVector;
  yV = yVector;

  if((player.locX < 5 && xV < 0) || (player.locX > 500) && (xV > 0)){
      player.locY -= speed * yV;
  }else if((player.locY < 5 && yV > 0) || (player.locY > 500) && (yV < 0)){
      player.locX += speed * xV;
  }else{
      player.locX += speed * xV;
      player.locY -= speed * yV;
  }    
})


// =====================
// =======UPDATE========
// =====================