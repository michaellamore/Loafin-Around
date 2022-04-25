class Obstacle extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, speed, row, elevation){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.setOrigin(0.5);
    this.currentPos = [row, 21]; // X and Y based on a simple grid
    this.targetPos = [x, y];
    this.elevation = elevation;
    this.movespeed = speed;
  }

  // Gets called every interval
  updateVariables(){
    this.targetPos = [this.targetPos[0]-32, this.targetPos[1]+16];
    this.currentPos[1]--;
    this.setDepth(this.calculateDepth() + (this.elevation*5));
  }
  tryToDestroy(){
    if(this.x < -100 && this.y > game.config.height+100){
      this.destroy();
      return true;
    }
    return false;
  }

  // Gets called every update()
  move(delta){
    if(this.targetPos == null) return;
    // If the obstacle hasn't reached the target, move towards it
    if(this.x > this.targetPos[0]) this.x -= this.movespeed*(delta);
    if(this.y < this.targetPos[1]) this.y += (this.movespeed/2)*(delta);

    // If the obstacle has moved past the target, realign the obstacle to target
    if(this.x < this.targetPos[0]) this.x = this.targetPos[0];
    if(this.y > this.targetPos[1]) this.y = this.targetPos[1];
  } 

  moveOLD(){
    this.x -= 32;
    this.y += 16;
  }

  calculateDepth(){
    let row = this.currentPos[0];
    let column = this.currentPos[1];
    let depth = 111; // Arbitrary number
    for(let i=0; i < row; i++) depth += 1;
    for(let i=0; i < column; i++) depth -= 5;
    return depth;
  }
}