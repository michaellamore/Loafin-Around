class Background extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, speed){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.setOrigin(0, 1);
    this.setDepth(-10);
    this.startPos = [x, y];
    this.targetPos = [x, y];
    this.movespeed = speed;
    this.cutoffPos = [-1520, 1328]; // Depends on dimensions of image;
  }

  changeTarget(){
    if(this.x <= this.cutoffPos[0] && this.y >= this.cutoffPos[1]){
      this.x = this.startPos[0];
      this.y = this.startPos[1];
      this.targetPos = [this.startPos[0], this.startPos[1]];
    }
    this.targetPos = [this.targetPos[0]-32, this.targetPos[1]+16];
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
}