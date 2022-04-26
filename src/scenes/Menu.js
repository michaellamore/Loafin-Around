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

    this.punConfig = {
      fontFamily: 'Upheavtt',
      fontSize: '16px',
      color: '#c09473',
      stroke: '#10141f',
      strokeThickness: 4,
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 0
    }

    this.load.path = './assets/';
    // Images
    this.load.image('platform', 'platform.png');
    this.load.image('title', 'title.png');
    this.load.image('darkenBG', 'darkenBG.png');
    this.load.atlas('spriteAtlas', 'spriteAtlas.png', 'spriteAtlas.json');
    // Animations
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
  }

  create() {
    // BG Stuff
    this.spriteSpeed = 80;
    this.background = new Background(this, -16, game.config.height + 96, 'platform', 0, this.spriteSpeed);
    this.add.image(0, 0, 'darkenBG').setOrigin(0,0);
    this.timer1 = this.time.addEvent({
      delay: 1000, 
      callback: function() {this.background.changeTarget()},
      loop: true,
      callbackScope: this
    })

    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    // (Goofy ahh) puns courtesy of https://www.southernliving.com/culture/bread-puns-jokes
    this.breadPuns = [
      "You're toast",
      "Wheat it and weep",
      "Bready or not, here I crumb",
      "You don't want naan of this",
      "Risk it for the biscuit",
      "You're the apple of my rye",
      "You're on a roll", 
      "Stop loafing around",
      "Don't be so sour, dough",
      "Baking is a labor of loaf",
      "Don't worry, you can crust me",
      "These bread puns are so crumby",
      "Let's grow mold together"
    ];
    this.add.image(0, 0, 'title').setOrigin(0, 0);
    this.add.text(game.config.width/2, game.config.height/2 + 128, 'Use (A)(D) to Move', this.textConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + 180, 'Press (F) to Start', this.textConfig).setOrigin(0.5);
    this.currentPun = this.getRandomPun();
    this.pun = this.add.text(game.config.width/2 + 190, 60, this.currentPun, this.punConfig).setOrigin(0.5);
    this.pun.angle = 20;

    // Increasing and decreasing scale of pun text
    this.increasing = true;
    this.timer2 = this.time.addEvent({
      delay: 100, 
      callback: function() {
        if(parseInt(this.pun.style.fontSize) <= 16) this.increasing = true;
        if(parseInt(this.pun.style.fontSize) >= 20) this.increasing = false;
        if(this.increasing) this.pun.setFontSize(parseInt(this.pun.style.fontSize)+1);
        if(!this.increasing) this.pun.setFontSize(parseInt(this.pun.style.fontSize)-1);
      },
      loop: true,
      callbackScope: this
    })
  }

  update(time, delta){
    this.background.move(delta/1000);

    if(Phaser.Input.Keyboard.JustDown(keyLeft) || Phaser.Input.Keyboard.JustDown(keyRight)) this.pun.text = this.getRandomPun();
    if(keyAction.isDown){
      this.scene.start('playScene');
      this.sound.play('sfx_menu'); 
    }
  }

  getRandomPun(){
    let index = Math.floor(Math.random() * this.breadPuns.length)
    if(this.currentPun != null && this.breadPuns[index] == this.currentPun) this.getRandomPun();
    return this.breadPuns[index];
  }
}