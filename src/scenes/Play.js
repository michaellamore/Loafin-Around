class Play extends Phaser.Scene {
  constructor() {
    super ("playScene");
  }

  preload(){
    this.scoreConfig = {
      fontFamily: 'Upheavtt',
      fontSize: '28px',
      color: '#FFFFFF',
      align: 'left',
      stroke: '#10141f',
      strokeThickness: 6
    }
  }

  create() {
    console.log("In Play Scene");
    // VARIABLES
    this.score = 0;
    this.timerDelay = 1000;
    this.spriteSpeed = 80;
    
    // Set the keys
    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.platform = new Background(this, -16, game.config.height + 96, 'platform', 0, this.spriteSpeed);
    this.scoreText = this.add.text(game.config.width/2, 64, this.score, this.scoreConfig).setOrigin(0.5);
    this.generateAnimations();

    // Zone Stuff
    this.zoneManager = new ZoneManager();
    this.zoneManager.create();
    this.zoneManager.moveZones();

    // Obstacles & Speed up zones
    this.obstaclesArray = [];
    this.speedupArray = [];
    this.collectableArray = [];
    this.createNewEntities();

    // Interval to do things on
    this.timer = this.time.addEvent({
      delay: this.timerDelay, 
      callback: function() {
        this.zoneManager.moveZones();
        for(const obstacle of this.obstaclesArray){
          obstacle.tryToDestroy();
          obstacle.updateVariables();
        }
        for(const speedup of this.speedupArray){
          if(speedup.currentPos[0] == this.player.currentPos[0] &&
            speedup.currentPos[1] == this.player.currentPos[1]) {
            speedup.destroy();
          }
          speedup.tryToDestroy();
          speedup.updateVariables();
        }
        for(const collectable of this.collectableArray){
          // Check for collision with player
          if(collectable.currentPos[0] == this.player.currentPos[0] &&
            collectable.currentPos[1] == this.player.currentPos[1]) {
            this.addScore(50);
            collectable.destroy();
          }
          collectable.tryToDestroy();
          collectable.updateVariables();
        }
        this.platform.changeTarget();
        this.createNewEntities();
        this.player.checkMovement();
        this.addScore(10);
      },
      loop: true,
      callbackScope: this
    })

    // Different timer to increment speed and make the game harder (and fun!)
    this.timer2 = this.time.addEvent({
      delay: 15000,                
      callback: function(){ this.incrementSpeed(); },
      callbackScope: this,
      repeat: 2
    });

    this.player = new Player(this, 240, 352, 'rotateForward', 0, this.spriteSpeed, this.zoneManager.zones).setOrigin(0.5);
  }

  update(time, delta){
    // delta is the amount of time in-between update() calls. 
    for(const obstacle of this.obstaclesArray) obstacle.move(delta/1000); // Convert delta to milliseconds
    for(const speedup of this.speedupArray) speedup.move(delta/1000);
    for(const collectable of this.collectableArray) collectable.move(delta/1000);
    this.platform.move(delta/1000);

    this.player.move(delta/1000);
    this.player.getInput();

    if(this.player.isDead) this.scene.start("gameoverScene");
  }

  // Responsible for spawning in obstacles AND speed up zones
  createNewEntities(){
    let zones = this.zoneManager.zones
    let column = 22;
    for (let row = 0; row <= 4; row++) {
      let tile = zones[row][column];
      // Offset includes x and y values in array. Different offsets for different zones. Zones 0-4. 
      let offset = [80-(32*row) , 448 + (16*row)];

      let randomSprite = spriteNames[Math.floor(Math.random() * spriteNames.length)];
      let randomSprite2 = spriteNames[Math.floor(Math.random() * spriteNames.length)];
      // If current point is 1, add a 1-cube-tall sprite
      if(tile == 1) this.obstaclesArray.push(new Obstacle(this, 32*(column)-offset[0] , offset[1]-16*(column), 'spriteAtlas', randomSprite, this.spriteSpeed, row, 0));
      // if current point is 2, add 2 1-cube-tall sprites on top of each other
      if(tile == 2){
        this.obstaclesArray.push(new Obstacle(this, 32*(column)-offset[0] , offset[1]-16*(column), 'spriteAtlas', randomSprite, this.spriteSpeed, row, 0));
        this.obstaclesArray.push(new Obstacle(this, 32*(column)-offset[0] , offset[1]-16*(column) - 32, 'spriteAtlas', randomSprite2, this.spriteSpeed, row, 1));
      }
      // If it's a T, it's a teleport zone
      if(tile == 'T') this.speedupArray.push(new Speedzone(this, 32*(column)-offset[0] , offset[1]-16*(column), 'speedupZone', 0, this.spriteSpeed, row));
      // If current point is C, spawn collectables
      if(tile == 'C')this.collectableArray.push(new Collectable(this, 32*(column)-offset[0] , offset[1]-16*(column) + 8, 'collectable', 0, this.spriteSpeed, row));
    }
  }

  addScore(score){
    this.score += score;
    this.scoreText.text = this.score
  }

  incrementSpeed(){
    console.log("Incrementing Speed");
    this.timer.delay -= 200;
    this.timer2.delay += 15000;
    this.spriteSpeed += 20;
    for(const obstacle of this.obstaclesArray) obstacle.movespeed = this.spriteSpeed;
    for(const speedup of this.speedupArray) speedup.movespeed = this.spriteSpeed;
    for(const collectable of this.collectableArray) collectable.movespeed = this.spriteSpeed;
    this.platform.movespeed = this.spriteSpeed;
    this.player.movespeed = this.spriteSpeed;
    this.player.anims.timeScale += .25;
  }

  generateAnimations(){
    this.anims.create({
      key: 'rotateForward', 
      frames: this.anims.generateFrameNumbers('rotateForward', {start: 0, end: 10, first: 0}),
      frameRate: 30,
    });
    this.anims.create({
      key: 'rotateLeft', 
      frames: this.anims.generateFrameNumbers('rotateLeft', {start: 0, end: 10, first: 0}),
      frameRate: 30,
    });
    this.anims.create({
      key: 'rotateRight', 
      frames: this.anims.generateFrameNumbers('rotateRight', {start: 0, end: 10, first: 0}),
      frameRate: 30,
    });

    this.anims.create({
      key: 'butter', 
      frames: this.anims.generateFrameNumbers('collectable', {start: 0, end: 7, first: 0}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'jam', 
      frames: this.anims.generateFrameNumbers('speedupZone', {start: 0, end: 7, first: 0}),
      frameRate: 10,
      repeat: -1
    });
  }
}