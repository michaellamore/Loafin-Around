class Player extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, speed, zones){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.scene = scene;
    this.zones = zones;
    this.currentPos = [2, 7]; // Row (0-4), Column (0-22)
    this.targetPos;
    this.elevation = 0;
    this.currentAction = "forward";
    this.isDead = false;
    this.movespeed = speed;
  }

  getInput(){
    if(Phaser.Input.Keyboard.JustDown(keyLeft) && this.currentPos[0] > 0) this.currentAction = "left";
    if(Phaser.Input.Keyboard.JustDown(keyRight) && this.currentPos[0] < 4) this.currentAction = "right";
}

  checkMovement(){
    this.checkOutOfBounds();

    // Movement depends on surrounding tiles, current tile, and player input
    let currentTile = this.zones[this.currentPos[0]][this.currentPos[1]];
    let neighborTiles = this.getSurroundingTiles();
    let TileTwoAhead = this.zones[this.currentPos[0]][this.currentPos[1]+2];

    // Moving will change the row and column of the player
    if(this.currentAction == "left"){
      if(neighborTiles[0]-2 == this.elevation){
        this.currentAction = "forward"; 
      } else {
        if(neighborTiles[0]==2 || neighborTiles[0]==1 || neighborTiles[0]==0) this.elevation = neighborTiles[0];
        if(neighborTiles[0]=='T' || neighborTiles[0]=='C') this.elevation = 0;
        this.currentPos[0]--;
        this.currentPos[1]--;
        this.anims.play('rotateLeft');
      }
    }
    if(this.currentAction == "right"){
      if(neighborTiles[2]-2 == this.elevation){
        this.currentAction = "forward"; 
      } else {
        if(neighborTiles[2]==2 || neighborTiles[2]==1 || neighborTiles[2]==0) this.elevation = neighborTiles[2];
        if(neighborTiles[2]=='T' || neighborTiles[2]=='C') this.elevation = 0;
        this.currentPos[0]++;
        this.currentPos[1]--;
        this.anims.play('rotateRight');
      }
    }
    if(this.currentAction == "forward"){
      if(currentTile == `T`) {
        this.currentPos[1]++; // Speed up
        if(TileTwoAhead == 1 || TileTwoAhead == 2) this.elevation = TileTwoAhead; // Elevate
        this.anims.play('rotateForward'); 
      } else {
        if(neighborTiles[1]-2 == this.elevation){
          this.currentPos[1]--;
          this.scene.sound.play('sfx_blocked');
        } else {
          if(neighborTiles[1]==2 || neighborTiles[1]==1 || neighborTiles[1]==0) this.elevation = neighborTiles[1];
          if(neighborTiles[1]=='T' || neighborTiles[1]=='C') this.elevation = 0;
          this.anims.play('rotateForward'); 
        }
      }  
    }
    // Make sure player is re-aligned before moving again
    if(this.targetPos != null && this.x != this.targetPos[0]) this.x = this.targetPos[0];
    if(this.targetPos != null && this.y != this.targetPos[1]) this.y = this.targetPos[1];

    // After changing the row/column of player, convert it into game coordinates
    let coords = this.gridToCoords();
    this.targetPos = [coords[0], coords[1]-(32*this.elevation)];

    this.setDepth(this.calculateDepth() + (this.elevation*5));
    this.reset();
  }

  move(delta){
    if(this.targetPos == null) return;
    // If the player hasn't reached the target, move towards it
    let multiplier = 1 + (this.elevation/1.5);
    if(this.y < this.targetPos[1]) this.y += this.movespeed*multiplier*delta;
    if(this.y > this.targetPos[1]) this.y -= this.movespeed*multiplier*delta;
    if(this.x > this.targetPos[0]) this.x -= this.movespeed*2*delta;
    if(this.x < this.targetPos[0]) this.x += this.movespeed*2*delta;
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

  reset(){ this.currentAction = "forward"; }

  checkOutOfBounds(){
    // If the player's column reaches the red zones, DIE
    if(this.currentPos[1] <= 1 || this.currentPos[1] >= 19) this.isDead = true;
  }

  // Based on position of player on a grid, convert it into x-y positions;
  gridToCoords(){
    let row = this.currentPos[0];
    let column = this.currentPos[1];
    // These are the coordinates for the very first row/column;
    let x = -48;
    let y = 436;
    for(let i=0; i < row; i++){
      x += 32;
      y += 16;
    }
    for(let i=0; i < column; i++){
      x += 32;
      y -= 16;
    }
    return [x, y];
  }
  
  calculateDepth(){
    let row = this.currentPos[0];
    let column = this.currentPos[1];
    let depth = 111; //Arbitrary number
    for(let i=0; i < row; i++) depth += 1;
    for(let i=0; i < column; i++) depth -= 5;
    return depth;
  }
}