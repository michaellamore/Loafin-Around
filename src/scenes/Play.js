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

  create() {
    // VARIABLES
    this.timerDelay = 1000;
    // this.currentDepth = 0;

    // Set the keys
    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.platform = this.add.image(0, 0, 'platform').setOrigin(0, 0).setDepth(-10);

    // Zone Stuff
    this.zoneManager = new ZoneManager();
    this.zoneManager.create();
    this.zoneManager.moveZones();

    // Obstacles
    this.obstacles = [];
    this.createNewObstacles();

    // Interval to do things on
    this.timer = this.time.addEvent({
      delay: this.timerDelay, 
      callback: function() {
        this.zoneManager.moveZones();

        for(const obstacle of this.obstacles){
          obstacle.move();
          let destroyed = obstacle.tryToDestroy();
          if(destroyed){
            const index = this.obstacles.indexOf(obstacle);
            this.obstacles.splice(index, 1);
          }
        }
        this.createNewObstacles();

        this.player.move();
      },
      loop: true,
      callbackScope: this
    })

    this.player = new Player(this, 32*5 - 16, game.config.height - 16*5 - 32, 'player', 0, this.zoneManager.zones).setOrigin(0.5);
  }

  update(){
    this.player.getInput();
  }

  createNewObstacles(){
    let zones = this.zoneManager.zones
    let maxNumZones = 23;
    for (let row = 0; row <= 4; row++) {
      let currentPoint = zones[row][maxNumZones-1];
      // Offset includes x and y values in array. Different offsets for different zones. Zones 0-4. 
      let offset = [80-(32*row) , 448 + (16*row)];

      // If current point is 0, do nothing
      // If current point is 1, add a 1-cube-tall sprite
      if(currentPoint == 1) this.obstacles.push(new Obstacle(this, 32*(maxNumZones)-offset[0] , offset[1]-16*(maxNumZones), 'obstacle', 0));
    }
  }
}