class Instructions extends Phaser.Scene {
  constructor() {
    super ("instructionsScene");
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
    // Variables
    this.currentScene = 0;

    // Inputs
    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    
    this.tutorial = this.add.sprite(0, 0, 'instructionMovement', 0).setOrigin(0);
    this.tutorial.play('instructionMovement');
    this.zoneLeft = this.add.zone(0, 0, game.config.width*0.45, game.config.height).setOrigin(0).setInteractive();
    this.zoneRight = this.add.zone(game.config.width-(game.config.width*0.45), 0, game.config.width*0.45, game.config.height).setOrigin(0).setInteractive();
    
    this.zoneLeft.on('pointerdown', () => {
      if(this.currentScene != 0){
        this.currentScene--;
        this.generateText();
      }
    }, this);
    this.zoneRight.on('pointerdown', () => {
      this.currentScene++
      this.generateText();
    }, this);
  }

  update(){
    if(Phaser.Input.Keyboard.JustDown(keyLeft) && this.currentScene > 0){
      this.currentScene--;
      this.generateText();
    }
    if(Phaser.Input.Keyboard.JustDown(keyRight)){
      this.currentScene++;
      this.generateText();
    }
  }

  generateText(){
    // Movement
    if(this.currentScene == 0) this.tutorial.play('instructionMovement');
    // Obstacles
    if(this.currentScene == 1) this.tutorial.play('instructionObstacle');
    // Collectables
    if (this.currentScene == 2) this.tutorial.play('instructionCollectable');
    if (this.currentScene >= 3) this.scene.start('menuScene');
  }
}