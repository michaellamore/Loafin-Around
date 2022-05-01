class Input extends Phaser.Scene {
  constructor() {
    super ("inputScene");
  }

  preload(){
    this.load.path = './assets/';
    // Images
    this.load.image('platform', 'platform.png');
    this.load.image('title', 'title.png');
    this.load.image('darkenBG', 'darkenBG.png');
    this.load.atlas('spriteAtlas', 'spriteAtlas.png', 'spriteAtlas.json');
    // Animations
    this.load.spritesheet('menuPlay', 'menuPlay.png', {frameWidth: 320, frameHeight: 160});
    this.load.spritesheet('menuInstructions', 'menuInstructions.png', {frameWidth: 320, frameHeight: 160});
    this.load.spritesheet('instructionMovement', 'movementSheet.png', {frameWidth: 640, frameHeight: 480});
    this.load.spritesheet('instructionObstacle', 'obstacleSheet.png', {frameWidth: 640, frameHeight: 480});
    this.load.spritesheet('instructionCollectable', 'collectableSheet.png', {frameWidth: 640, frameHeight: 480});
    this.load.spritesheet('collectable', 'butter.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('speedupZone', 'jam.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('rotateForward', 'breadForward.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('rotateLeft', 'breadLeft.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('rotateRight', 'breadRight.png', {frameWidth: 64, frameHeight: 64});
    // Sound
    this.load.audio('sfx_blocked', 'sfx_blocked.wav');
    this.load.audio('sfx_menu', 'sfx_menu.wav');
    this.load.audio('sfx_move', 'sfx_move.wav');
    this.load.audio('sfx_pickup', 'sfx_pickup.wav');
    this.load.audio('sfx_speedup', 'sfx_speedup.wav');

    this.textConfig = {
      fontFamily: 'PixelFont',
      fontSize: '28px',
      color: '#FFFFFF',
      stroke: '#10141f',
      strokeThickness: 6,
      align: 'right',
    }
  }

  create(){
    this.scene.start('menuScene');

    // Inputs
    this.pointer = this.input.activePointer;
    // Temp stuff
    this.add.image(0, 0, 'title').setOrigin(0, 0);
    this.add.text(game.config.width/2, 360, `CLICK TO CONTINUE`, this.textConfig).setOrigin(0.5);

    // Generate animations
    this.anims.create({
      key: 'pressedPlay', 
      frames: this.anims.generateFrameNumbers('menuPlay', {start: 0, end: 1, first: 0}),
      frameRate: 10,
    });
    this.anims.create({
      key: 'pressedInstructions', 
      frames: this.anims.generateFrameNumbers('menuInstructions', {start: 0, end: 1, first: 0}),
      frameRate: 10,
    });
    this.anims.create({
      key: 'instructionMovement', 
      frames: this.anims.generateFrameNumbers('instructionMovement', {start: 0, end: 1, first: 0}),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'instructionObstacle', 
      frames: this.anims.generateFrameNumbers('instructionObstacle', {start: 0, end: 1, first: 0}),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'instructionCollectable', 
      frames: this.anims.generateFrameNumbers('instructionCollectable', {start: 0, end: 1, first: 0}),
      frameRate: 2,
      repeat: -1
    });
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

  update(){
    if(this.pointer.isDown) this.scene.start('menuScene');
  }
}