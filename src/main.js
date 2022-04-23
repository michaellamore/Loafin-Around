let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  parent: "phaser-canvas",
  pixelArt: true,
  zoom: 1,
  fps:{
    target: 60,
    forceSetTimeOut: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0},
      debug: false
    }
  },
  scene: [Menu, Play, Gameover]
}
// Load up JSON file that has all obstacles and set it to a global variable
let availableObstacles;
let numOfObstacles = 0;
async function loadJSON(){
  let zoneJSON = await fetch("./src/prefabs/AvailableObstacles.json");
  let zoneTEXT = await zoneJSON.text();
  availableObstacles = JSON.parse(zoneTEXT);
  for(const key in availableObstacles) numOfObstacles++;
}
loadJSON();




let game = new Phaser.Game(config);

let keyLeft, keyRight, keyAction;



