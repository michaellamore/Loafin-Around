class Play extends Phaser.Scene {
  constructor() {
    super ("playScene");
  }

  preload(){
  }

  create() {
    console.log("In Play Scene");
    // VARIABLES
    this.timerDelay = 1000;

    this.generateAnimations();

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
          let destroyed = obstacle.tryToDestroy();
          // CAUSES AN ISSUE THAT MAKES SOME OBSTACLES NOT MOVE AT THE VERY END
          // if(destroyed){
          //   const index = this.obstacles.indexOf(obstacle);
          //   this.obstacles.splice(index, 1);
          // }

          // obstacle.moveOLD();
          obstacle.updateVariables();
        }
        this.createNewObstacles();

        this.player.checkMovement();
      },
      loop: true,
      callbackScope: this
    })

    this.player = new Player(this, 240, 352, 'rotateForward', 0, this.zoneManager.zones).setOrigin(0.5);
  }

  update(time, delta){
    // delta is the amount of time in-between update() calls. 
    for(const obstacle of this.obstacles) obstacle.move(delta/1000); // Convert delta to milliseconds
    this.player.getInput();
    if(this.player.isDead) this.scene.start("gameoverScene");
  }

  createNewObstacles(){
    let zones = this.zoneManager.zones
    let column = 22;
    for (let row = 0; row <= 4; row++) {
      let tile = zones[row][column];
      // Offset includes x and y values in array. Different offsets for different zones. Zones 0-4. 
      let offset = [80-(32*row) , 448 + (16*row)];

      // If current point is 0, do nothing
      // If current point is 1, add a 1-cube-tall sprite
      if(tile == 1) this.obstacles.push(new Obstacle(this, 32*(column)-offset[0] , offset[1]-16*(column), 'obstacle', 0, row));
      if(tile == 2) this.obstacles.push(new Obstacle(this, 32*(column)-offset[0] , offset[1]-16*(column+1), 'obstacleTall', 0, row));
    }
  }

  generateAnimations(){
    this.anims.create({
      key: 'rotateForward', 
      frames: this.anims.generateFrameNumbers('rotateForward', {start: 0, end: 10, first: 0}),
      frameRate: 30,
    });
  }
}