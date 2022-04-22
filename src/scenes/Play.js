class Play extends Phaser.Scene {
  constructor() {
    super ("playScene");
  }

  preload(){
    this.load.path = './assets/';
    this.load.image('player', 'cubePink.png');
    this.load.image('obstacle', 'cubeBlue.png');
    this.load.image('obstacleTall', 'cubeBlueTall.png');
    this.load.image('platform', 'platform.png');
  }

  /* 
    TODO:
    - Add menu with how to play
    - Add scoring system
    - (if there's time) Add sound
  */

  create() {
    // VARIABLES
    this.timerDelay = 1000;
    this.currentDepth = 0;

    // Set the keys
    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.platform = this.add.image(0, 0, 'platform').setOrigin(0, 0).setDepth(-99999);

    // Zone Stuff
    this.zoneManager = new ZoneManager();
    this.zoneManager.create();
    this.zoneManager.moveZones();

    // Obstacles
    this.obstacles = [];
    this.createNewObstacles();

    // Move everything
    this.timer = this.time.addEvent({
      delay: this.timerDelay, 
      callback: function() {
        this.zoneManager.moveZones();
        this.updateObstacles();
        this.destroyOldObstacles();
        this.createNewObstacles();
        this.player.updatePlayer();
        this.player.reset();
      },
      loop: true,
      callbackScope: this
    })

    this.player = new Player(this, 32*5 - 16, game.config.height - 16*5 , 'player', 0, this.zoneManager).setOrigin(0.5);
  }

  update(){
    this.player.getInput();
  }

  /* 
    TODO:
    - (if there's time) Create an "Obstacle" prefab and add this code to it 
    - (if there's time) Animate the movement instead of just teleporting
  */
  createNewObstacles(){
    let zones = this.zoneManager.zones
    let maxNumZones = 23;
    for (let zoneIndex = 0; zoneIndex <= 4; zoneIndex++) {
      let currentPoint = zones[zoneIndex][maxNumZones-1];
      // Offset includes x and y values in array. Different offsets for different zones. Zones 0-4. 
      let offset = [80-(32*zoneIndex) , 448 + (16*zoneIndex)];

      // If current point is 0, do nothing
      // If current point is 1, add a 1-cube-tall sprite
      if(currentPoint == 1) {
        let newObstacle = this.add.image(32*(maxNumZones) - offset[0], offset[1] - 16*(maxNumZones), 'obstacle').setOrigin(0.5).setDepth(this.currentDepth);
        this.obstacles.push(newObstacle);
      }

      // If current point is 2, add a 2-cube-tall sprite
      if(currentPoint == 2) {
        let newObstacle = this.add.image(32*(maxNumZones) - offset[0], offset[1] - 16*(maxNumZones+1), 'obstacleTall').setOrigin(0.5).setDepth(this.currentDepth);
        this.obstacles.push(newObstacle);
      }
    }
    this.currentDepth--;
  }

  destroyOldObstacles(){
    for (const obstacle of this.obstacles){
      if(obstacle.x < -64 && obstacle.y > game.config.height + 64) { // If obstacle is out of the screen, delete it
        obstacle.destroy();
        const index = this.obstacles.indexOf(obstacle);
        this.obstacles.splice(index, 1);
      }
    }
  }

  updateObstacles(){
    for(const obstacle of this.obstacles){
      obstacle.x -= 32;
      obstacle.y += 16;
    }
  }
}