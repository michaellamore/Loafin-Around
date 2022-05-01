class Gameover extends Phaser.Scene {
  constructor() {
    super ("gameoverScene");
  }

  init(data) {this.playerScore = data.score;}

  preload(){
    this.textConfig = {
      fontFamily: 'PixelFont',
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
  this.scoreConfig = {
    fontFamily: 'PixelFont',
    fontSize: '28px',
    color: '#4f8fba',
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
    // BG Stuff
    this.spriteSpeed = 80;
    this.background = new Background(this, -16, game.config.height + 96, 'platform', 0, this.spriteSpeed);
    this.add.image(0, 0, 'darkenBG').setOrigin(0,0);
    this.timer = this.time.addEvent({
      delay: 1000, 
      callback: function() {this.background.changeTarget()},
      loop: true,
      callbackScope: this
    })

    keyAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    let highscoreText = 'Current Highscore: ';
    if(this.playerScore > highscore){
      highscoreText = `NEW HIGHSCORE: `;
      this.scoreConfig.color = '#cf573c';
      highscore = this.playerScore;
    }

    this.add.text(game.config.width/2, game.config.height/2 + 32, '(F) to Restart, (D) for Menu', this.textConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2, highscoreText + highscore.toString(), this.scoreConfig).setOrigin(0.5);
    this.textConfig.fontSize = '60px';
    this.add.text(game.config.width/2, game.config.height/2 - 128, 'GAMEOVER', this.textConfig).setOrigin(0.5);
  }

  update(time, delta){
    this.background.move(delta/1000);

    if(Phaser.Input.Keyboard.JustDown(keyAction)) this.scene.start("playScene");
    if(Phaser.Input.Keyboard.JustDown(keyRight)) this.scene.start("menuScene");
  }
}