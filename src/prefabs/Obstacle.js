class Obstacle extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.scene = scene;
    this.setOrigin(0.5);
    this.movespeed = 40;
    this.targetPos;
  }

  updateVariables(){
    this.targetPos = [Math.floor(this.x - 32), Math.floor(this.y + 16)];
    this.setDepth(this.depth + 1);
  }

  move(delta){
    if(this.targetPos == null) return;
    // If the obstacle hasn't reached the target, move towards it
    if(this.x > this.targetPos[0]) this.x -= this.movespeed*(delta);
    if(this.y < this.targetPos[1]) this.y += (this.movespeed/2)*(delta);

    // If the obstacle has moved past the target, realign the obstacle to target
    if(this.x < this.targetPos[0]) this.x = this.targetPos[0];
    if(this.y > this.targetPos[1]) this.y = this.targetPos[1];
    
  }

  tryToDestroy(){
    if(this.x < -32 && this.y > game.config.height + 16){
      this.destroy();
      return true;
    }
    return false;
  }
}