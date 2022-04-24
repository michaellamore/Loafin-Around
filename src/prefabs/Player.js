class Player extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, zones){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.zones = zones;
    this.currentPos = [2, 7]; // Row (0-4), Column (0-22)
    this.elevation = 0;
    this.currentAction = "forward";
    this.isDead = false;
  }

  getInput(){
    if(Phaser.Input.Keyboard.JustDown(keyLeft) && this.currentPos[0] > 0) this.currentAction = "left";
    if(Phaser.Input.Keyboard.JustDown(keyRight) && this.currentPos[0] < 4) this.currentAction = "right";
}

  checkMovement(){
    // Movement depends on surrounding tiles, current tile, and player input
    let currentTile = this.zones[this.currentPos[0]][this.currentPos[1]];
    let neighborTiles = this.getSurroundingTiles();
    // Moving will change the row and column of the player
    if(this.currentAction == "left"){
      if (currentTile+1 == neighborTiles[0]) this.elevation++;
      if (currentTile-1 == neighborTiles[0]) this.elevation--;
      if (!(currentTile+2 == neighborTiles[0])){
        this.currentPos[0]--;
        this.currentPos[1]--;
      }
    }
    if(this.currentAction == "right"){
      if (currentTile+1 == neighborTiles[2]) this.elevation++;
      if (currentTile-1 == neighborTiles[2]) this.elevation--;
      if (!(currentTile+2 == neighborTiles[2])){
        this.currentPos[0]++;
        this.currentPos[1]--;
      }
      
    }
    if(this.currentAction == "forward"){
      if (currentTile+1 == neighborTiles[1]) this.elevation++;
      if (currentTile-1 == neighborTiles[1]) this.elevation--;
      if (currentTile+2 == neighborTiles[1]) this.currentPos[1]--;
      if (currentTile-2 == neighborTiles[1]) this.elevation -= 2;
    }

    // After changing the row/column of player, convert it into game coordinates
    let coords = this.gridToCoords();
    this.x = coords[0];
    this.y = coords[1] - (32*this.elevation);

    this.setDepth(this.calculateDepth() + (this.elevation*5));
    this.anims.play('rotateForward');
    this.reset();
    this.checkOutOfBounds();
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
    if(this.currentPos[1] == 1 || this.currentPos[1] == 20) this.isDead = true;
  }

  // Based on position of player on a grid, convert it into x-y positions;
  gridToCoords(){
    let row = this.currentPos[0];
    let column = this.currentPos[1];
    // These are the coordinates for the very first row/column;
    let x = -48;
    let y = 432;
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