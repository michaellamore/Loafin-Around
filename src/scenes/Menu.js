class Menu extends Phaser.Scene {
  constructor() {
    super ("menuScene");
  }

  preload(){
    this.textConfig = {
      fontFamily: 'Upheavtt',
      fontSize: '28px',
      color: '#FFFFFF',
      stroke: '#10141f',
      strokeThickness: 6,
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 0
    }

    this.load.path = './assets/';
    this.load.image('platform', 'platform.png');
    this.load.atlas('spriteAtlas', 'spriteAtlas.png', 'spriteAtlas.json');
    this.load.spritesheet('collectable', 'butter.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('speedupZone', 'jam.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('rotateForward', 'breadForward.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('rotateLeft', 'breadLeft.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('rotateRight', 'breadRight.png', {frameWidth: 64, frameHeight: 64});
  }

  create() {
    console.log("In Menu Scene");

    keyAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.add.text(game.config.width/2, game.config.height/2, 'Use (A)(D) to Move', this.textConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (F) to Start', this.textConfig).setOrigin(0.5);

    this.textConfig.fontSize = '60px';
    this.add.text(game.config.width/2, game.config.height/2 - 128, 'ROLLTATE', this.textConfig).setOrigin(0.5);
  }

  update(){
    if(keyAction.isDown) this.scene.start('playScene');
  }
}