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
let templateObstacles;
async function loadResources(){
  let yaml = await fetch("./src/TemplateObstacles.yaml")
  let yamlText = await yaml.text();
  templateObstacles = jsyaml.load(yamlText);
}
loadResources();

let game = new Phaser.Game(config);

let keyLeft, keyRight, keyAction;



