class Obstacle extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.setOrigin(0.5);
  }

  move(){
    this.x -= 32;
    this.y += 16;
    this.setDepth(this.depth + 1);
  }

  tryToDestroy(){
    if(this.x < -64 && this.y > game.config.height + 64){
      this.destroy();
      return true;
    }
    return false;
  }
}