let wHeight = window.innerHeight;
let wWidth = window.innerWidth;
// canvas eleent needs to be in a variable
const canvas = document.querySelector('#the-canvas');
// context is how we Draw
const context = canvas.getContext('2d');
// set canvas height and width to window height and width
canvas.height = wHeight;
canvas.width = wWidth;
const player = {} // this will be all things "this" player
let orbs = []; // global for all non-player orbs

// put the modals into variables so we can interact with them.
const loginmodal = new bootstrap.Modal(document.querySelector('#loginModal'));
const spawnmodal = new bootstrap.Modal(document.querySelector('#spawnModal'));

window.addEventListener('load', () => {
  loginmodal.show();
})

document.querySelector('.name-form').addEventListener('submit', (e) => {
  e.preventDefault();
  // const name = document.querySelector('#login-username').value;
  // login(name);
  player.name = document.querySelector('#name-input').value;
  document.querySelector('.player-name').innerHTML = player.name;
  loginmodal.hide();
  spawnmodal.show();
  console.log(player);
})

document.querySelector('.start-game').addEventListener('click', (e) => {
  spawnmodal.hide();
  const elArray = Array.from(document.querySelectorAll('.hiddenOnStart'))
    elArray.forEach(el => {
      el.removeAttribute('hidden')
    })
    init(); //init is inside of socketStuff.js
})