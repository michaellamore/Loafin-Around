class Player extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, zones){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.zones = zones.zones;
    this.currentPos = [2, 4]; // Row (0-4), Column (0-22)
    this.currentAction = null;
  }
  /* 
    TODO:
    - If player inputs something, should the movement be instant or wait for the interval?
    - Move player based on neighbor tiles
    - "Delay" player based on neighbor tiles
    - Add animations (if there's time)
  */

  getInput(){
    if(Phaser.Input.Keyboard.JustDown(keyLeft) && this.currentPos[0] > 0){
      this.currentAction = "left";
    }
    if(Phaser.Input.Keyboard.JustDown(keyRight) && this.currentPos[0] < 4){
      this.currentAction = "right";
    }
  }

  updatePlayer(){
    if(this.currentAction == "left") this.moveLeft();
    if(this.currentAction == "right") this.moveRight();
    // console.log(this.getSurroundingTiles());
  }

  // Outputs an array of three elements: The tile to the left, in front, and right of player (Above, right, and down in cartesian plane)
  getSurroundingTiles(){
    let output = [];
    let row = this.currentPos[0];
    let column = this.currentPos[1];
    // Above
    if(row <= 0) output.push(0);
    if(row > 0) output.push(this.zones[row - 1][column]);
    // In front
    output.push(this.zones[row][column + 1]);
    // Below
    if(row >= 4) output.push(0);
    if (row < 4) output.push(this.zones[row + 1][column]);
    return output;
  }

  getCurrentTile(){
    
  }

  reset(){
    this.currentAction = null;
  }

  moveLeft(){
    this.currentPos[0]--;
    this.x -= 32;
    this.y -= 16;
  }

  moveRight(){
    this.currentPos[0]++;
    this.x += 32;
    this.y += 16;
  }

  moveDown(){
  }

  moveUp(){
  }

  moveBack(){

  }
}