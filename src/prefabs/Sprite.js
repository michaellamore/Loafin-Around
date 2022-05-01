class Sprite extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y, texture, frame, type, speed, row, elevation){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.setOrigin(0.5, 0.5);
    this.type = type;
    this.movespeed = speed;
    this.elevation = elevation;
    this.currentPos = [row, 21]; // 21 is the column where spawning starts
    this.y -= 32*elevation;
    this.target = new Phaser.Math.Vector2(this.x, this.y);

    if(this.type == 'butter'){
      scene.physics.add.existing(this);
      this.anims.play(this.type);
      this.body.setCircle(4, 10, 16);
      this.setImmovable();
    }
    if(this.type == 'jam'){
      scene.physics.add.existing(this);
      this.anims.play(this.type);
      this.body.setCircle(4, 28, 40);
      this.setImmovable();
    }
  }

  updateVariables(){
    this.target.x -= 32;
    this.target.y += 16;
    this.currentPos[1]--;
    this.setDepth(this.calculateDepth() + (this.elevation*5));
  }

  tryToDestroy(){
    if(this.x < -300) this.destroy();
  }

  move(delta){
    // If the obstacle is near target, snap it to the target location
    let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
    if (distance < 6) {
      this.x = this.target.x;
      this.y = this.target.y;
    } else {  // If the obstacle hasn't reached the target, move towards it
      if(this.x > this.target.x) this.x -= this.movespeed*(delta);
      if(this.y < this.target.y) this.y += (this.movespeed/2)*(delta);
    }
  } 

  turnOff(){
    this.x = -200;
    this.y = game.config.height + 100;
    this.setActive(false);
    this.setVisible(false);
    this.body.setEnable(false);
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