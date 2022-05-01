class Menu extends Phaser.Scene {
  constructor() {
    super ("menuScene");
  }

  preload(){
    this.textConfig = {
      fontFamily: 'PixelFont',
      fontSize: '28px',
      color: '#FFFFFF',
      stroke: '#10141f',
      strokeThickness: 6,
      align: 'right',
    }
  }

  create() {
    this.pointer = this.input.activePointer;
    this.playButton = this.add.sprite(0, 80, 'menuPlay').setOrigin(0).setInteractive().setTint(0x7d7d7d);
    this.instructionButton = this.add.sprite(0, 200, 'menuInstructions').setOrigin(0).setInteractive().setTint(0x7d7d7d);;

    // On mouse input, do stuff
    this.playButton.on("pointerover", () => {
      this.playButton.setTint(0xffffff);
    })
    this.playButton.on("pointerout", () => {
      this.playButton.setTint(0x7d7d7d);
    })
    this.playButton.on("pointerup", () => {
      this.playButton.anims.play('pressedPlay')
      this.transitionToPlay();
    })
    this.instructionButton.on("pointerover", () => {
      this.instructionButton.setTint(0xffffff);
    })
    this.instructionButton.on("pointerout", () => {
      this.instructionButton.setTint(0x7d7d7d);
    })
    this.instructionButton.on("pointerup", () => {
      this.instructionButton.anims.play('pressedInstructions')
      this.transitionToInstructions();
    })
  }
  transitionToInstructions(){
    this.tween = this.tweens.add({
      targets: [this.instructionButton, this.playButton],
      y: '+=400',
      ease: "Sine.easeInOut",
      duration: 500,
      repeat: 0,
      yoyo: false
    })
    this.tween.on('complete', () => {
      this.scene.start(this.scene.start("instructionsScene"));
    });
  }
  transitionToPlay(){
    this.tween = this.tweens.add({
      targets: [this.instructionButton, this.playButton],
      y: '-=400',
      ease: "Sine.easeInOut",
      duration: 500,
      repeat: 0,
      yoyo: false
    })
    this.tween.on('complete', () => {
      this.scene.start(this.scene.start("playScene"));
    });
  }
}