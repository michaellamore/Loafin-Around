class Gameover extends Phaser.Scene {
  constructor() {
    super ("gameoverScene");
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
  }

  create() {
    console.log("In Gameover Scene");
    keyAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.add.text(game.config.width/2, game.config.height/2, 'Press (F) to restart', this.textConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (D) to go to Menu', this.textConfig).setOrigin(0.5);
    this.textConfig.fontSize = '60px';
    this.add.text(game.config.width/2, game.config.height/2 - 128, 'GAMEOVER', this.textConfig).setOrigin(0.5);
  }

  update(){
    if(Phaser.Input.Keyboard.JustDown(keyAction)) this.scene.start("playScene");
    if(Phaser.Input.Keyboard.JustDown(keyRight)) this.scene.start("menuScene");
  }
}