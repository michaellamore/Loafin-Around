let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  parent: "phaser-canvas",
  pixelArt: true,
  zoom: 1,
  fps:{
    // target: 60,
    // forceSetTimeOut: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0},
      debug: false
    }
  },
  scene: [Input, Menu, Instructions, Play, Gameover]
}
// Check if using a phone
let is_touch = false;
window.addEventListener('touchstart', function(){ is_touch = true; });

// Load up JSON file that has all obstacles and set it to a global variable
let templateObstacles;
let spriteNames = [];
async function loadResources(){
  const obstacle = await fetch("./src/TemplateObstacles.yaml");
  const obstacleText = await obstacle.text();
  templateObstacles = jsyaml.load(obstacleText);

  const sprites = await fetch("./assets/spriteAtlas.json")
  const spritesJSON = await sprites.json(); 
  for(const name in spritesJSON.frames) spriteNames.push(name);
}
loadResources();



let game = new Phaser.Game(config);

let keyLeft, keyRight, keyUp, keyDown, keyAction;
let highscore = 0;


