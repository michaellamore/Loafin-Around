class Player extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, zones){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.zones = zones;
    this.currentPos = [2, 7]; // Row (0-4), Column (0-22)
    this.height = 0;
    this.currentAction = "forward";
  }

  getInput(){
    if(Phaser.Input.Keyboard.JustDown(keyLeft) && this.currentPos[0] > 0){
      this.currentAction = "left";
    }
    if(Phaser.Input.Keyboard.JustDown(keyRight) && this.currentPos[0] < 4){
      this.currentAction = "right";
    }
  }

  checkMovement(){
    this.setDepth(21 - this.currentPos[1]);

    // Movement depends on surrounding tiles, current tile, and player input
    let currentTile = this.zones[this.currentPos[0]][this.currentPos[1]];
    let neighborTiles = this.getSurroundingTiles();
    // Moving will change the row and column of the player
    if(this.currentAction == "left"){
      this.currentPos[0]--;
      this.currentPos[1]--;
      if (currentTile+1 == neighborTiles[0]) this.height++;
      if (currentTile-1 == neighborTiles[0]) this.height--;
    }
    if(this.currentAction == "right"){
      this.currentPos[0]++;
      this.currentPos[1]--;
      if (currentTile+1 == neighborTiles[2]) this.height++;
      if (currentTile-1 == neighborTiles[2]) this.height--;
    }
    if(this.currentAction == "forward"){
      if (currentTile+1 == neighborTiles[1]) this.height++;
      if (currentTile-1 == neighborTiles[1]) this.height--;
    }

    // After changing the row/column of player, convert it into game coordinates
    let coords = this.gridToCoords();
    this.x = coords[0];
    this.y = coords[1] - (32*this.height);

    this.reset();
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

  // Based on position of player on a grid, convert it into x-y positions;
  gridToCoords(){
    let row = this.currentPos[0];
    let column = this.currentPos[1];
    // These are the coordinates for the very first row/column;
    let x = -16;
    let y = 384;
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
}