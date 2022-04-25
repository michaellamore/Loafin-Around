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
    this.load.image('obstacle', 'cubeBlue.png');
    this.load.image('obstacleTall', 'cubeBlueTall.png');
    this.load.image('speedupZone', 'cubeOrange.png');
    this.load.image('collectable', 'cubeYellow.png');
    this.load.image('platform', 'platformNew.png');
    this.load.image('player', 'cubePink.png');
    this.load.spritesheet('rotateForward', 'cubePinkForward.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('rotateLeft', 'cubePinkLeft.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('rotateRight', 'cubePinkRight.png', {frameWidth: 64, frameHeight: 64});
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