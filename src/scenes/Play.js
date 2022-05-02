class Play extends Phaser.Scene {
  constructor() {
    super ("playScene");
  }

  preload(){
    this.scoreConfig = {
      fontFamily: 'PixelFont',
      fontSize: '40px',
      color: '#FFFFFF',
      align: 'left',
      stroke: '#10141f',
      strokeThickness: 6
    }
  }

  create() {
    // VARIABLES
    this.score = 0;
    this.timerDelay = 1000;
    this.spriteSpeed = 80;

    // Zone Stuff
    this.zoneManager = new ZoneManager();
    this.zoneManager.create();
    this.zoneManager.moveZones();

    this.player = new Player(this, 240, 352, 'rotateForward', 0, this.spriteSpeed, this.zoneManager.zones).setOrigin(0.5);

    // Groups for obstacles, jam, butter, etc. 
    this.spriteGroup = this.add.group();

    // Collisions
    this.physics.add.collider(this.player, this.spriteGroup, this.handleCollision, null, this);
    
    // Set the keys and zones (for mobile)
    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.zoneLeft = this.add.zone(0, 0, game.config.width*0.45, game.config.height).setOrigin(0).setInteractive();
    this.zoneRight = this.add.zone(game.config.width-(game.config.width*0.45), 0, game.config.width*0.45, game.config.height).setOrigin(0).setInteractive();
    this.zoneLeft.on('pointerdown', () => {
      if(this.player.currentPos[0] > 0) this.player.currentAction = "left";
    }, this);
    this.zoneRight.on('pointerdown', () => {
      if(this.player.currentPos[0] < 4) this.player.currentAction = "right";
    }, this);
    this.player.currentAction = "forward"; // set it to forward in-case it was accidently changed

    this.platform = new Background(this, -16, game.config.height + 96, 'platform', 0, this.spriteSpeed);
    this.scoreText = this.add.text(game.config.width/2, 30, this.score, this.scoreConfig).setOrigin(0.5);
    this.createNewEntities();

    // Interval to do things on
    this.timer = this.time.addEvent({
      delay: this.timerDelay, 
      callback: function() {
        this.zoneManager.moveZones();

        Phaser.Actions.Call(this.spriteGroup.getChildren(), (sprite)=>{ 
          sprite.updateVariables(); 
          sprite.tryToDestroy();
        });

        this.platform.changeTarget();
        this.createNewEntities();
        this.player.checkMovement();
        this.addScore(10);
        // console.log(Math.floor(game.loop.actualFps));
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
  }

  update(time, delta){
    // delta is the amount of time in-between update() calls. 
    Phaser.Actions.Call(this.spriteGroup.getChildren(), (sprite)=>{ sprite.move(delta/1000); });
    
    this.platform.move(delta/1000);
    this.player.move(delta/1000);
    this.player.getInput();

    if(this.player.isDead) this.scene.start("gameoverScene", {score: this.score}); // Send score data to next scene to calculate highscore
  }

  // Responsible for spawning in obstacles, jam, and butter
  createNewEntities(){
    let zones = this.zoneManager.zones
    let column = 22;
    for (let row = 0; row <= 4; row++) {
      let tile = zones[row][column];
      let array = Array.from(tile);
      let offset = [80-(32*row) , 448 + (16*row)];
      
      let prevElement;
      for(let i=0; i < array.length; i++){
        let element = array[i];
        let randomSprite = spriteNames[Math.floor(Math.random() * spriteNames.length)];
        // If current point is 1, add a 1-cube-tall sprite
        if(element == "1"){
          let obstacle = new Sprite(this, 32*(column)-offset[0] , offset[1]-16*(column), 'spriteAtlas', randomSprite,'obstacle', this.spriteSpeed, row, 0);
          this.spriteGroup.add(obstacle);
        }
        // if current point is 2, add 2 1-cube-tall sprites on top of each other
        if(element == "2"){
          let obstacle1 = new Sprite(this, 32*(column)-offset[0] , offset[1]-16*(column), 'spriteAtlas', randomSprite,'obstacle', this.spriteSpeed, row, 0);
          let obstacle2 = new Sprite(this, 32*(column)-offset[0] , offset[1]-16*(column), 'spriteAtlas', randomSprite,'obstacle', this.spriteSpeed, row, 1);
          this.spriteGroup.add(obstacle1);
          this.spriteGroup.add(obstacle2);
        }
        // If it's a J, it's jam
        if(element == 'J'){
          let additionalHeight = 0;
          if(prevElement == 2) additionalHeight++;
          let jam = new Sprite(this, 32*(column)-offset[0] , offset[1]-16*(column), 'speedupZone', 0,'jam', this.spriteSpeed, row, i+additionalHeight);
          this.spriteGroup.add(jam);
        }
        // If current point is B, spawn butter
        if(element == 'B'){
          let additionalHeight = 0;
          if(prevElement == 2) additionalHeight++;
          let butter = new Sprite(this, 32*(column)-offset[0] , offset[1]-16*(column) + 8, 'collectable', 0,'butter', this.spriteSpeed, row, i+additionalHeight);
          this.spriteGroup.add(butter);
        }

        // If current point is S, it's a sliding obstacle
        if(element == 'S'){
          let obstacle1 = new Sprite(this, 32*(column)-offset[0] , offset[1]-16*(column), 'slideObstacle', 0,'obstacle', this.spriteSpeed, row, 0);
          let obstacle2 = new Sprite(this, 32*(column)-offset[0] , offset[1]-16*(column), 'spriteAtlas', randomSprite,'obstacle', this.spriteSpeed, row, 1);
          this.spriteGroup.add(obstacle1);
          this.spriteGroup.add(obstacle2);
        }

        // If It's an H, it's a hole in the floor
        if(element == 'H'){
          let hole = new Sprite(this, 32*(column)-offset[0] , offset[1]-16*(column) + 16, 'hole', 0,'hole', this.spriteSpeed, row, 0);
          this.spriteGroup.add(hole);
        }
        prevElement = element;
      }
      // Offset includes x and y values in array. Different offsets for different zones. Zones 0-4. 
      
    }
  }
  handleCollision(player, sprite){
    if(player.currentPos[0] != sprite.currentPos[0]) return; // Make sure that the player and sprite are in the same lane
    if(sprite.type == 'obstacle') return;
    if(sprite.type == 'butter'){
      this.addScore(50);
      this.sound.play('sfx_pickup');
    }
    if(sprite.type == 'jam'){
      player.speedup();
      this.sound.play('sfx_speedup');
    }
    sprite.turnOff();
  }

  addScore(score){
    this.score += score;
    this.scoreText.text = this.score
  }

  incrementSpeed(){
    this.player.anims.timeScale += .25;
    this.timer.delay -= 200;
    this.timer2.delay += 15000;
    this.spriteSpeed += 20;

    Phaser.Actions.Call(this.spriteGroup.getChildren(), (sprite)=>{ sprite.movespeed = this.spriteSpeed });
  
    this.platform.movespeed = this.spriteSpeed;
    this.player.movespeed = this.spriteSpeed;
  }
}