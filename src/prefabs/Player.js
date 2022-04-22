class Player extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, zones){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.zones = zones;
    this.currentPos = [2, 4]; // Row (0-4), Column (0-22)
    this.height = 0;
    this.currentAction = null;
  }

  getInput(){
    if(Phaser.Input.Keyboard.JustDown(keyLeft) && this.currentPos[0] > 0){
      this.currentAction = "left";
    }
    if(Phaser.Input.Keyboard.JustDown(keyRight) && this.currentPos[0] < 4){
      this.currentAction = "right";
    }
  }

  move(){
    // Movement depends on surrounding tiles, current tile, and player input
    let currentTile = this.zones[this.currentPos[0]][this.currentPos[1]];
    let neighborTiles = this.getSurroundingTiles();
    if(this.currentAction == "left"){
      // When going left, check left neighborTile to see if player needs to go up
      if(neighborTiles[0] == currentTile + 1) this.height++;
      this.x -= 32;
      this.y -= 16*(this.height+1);
      this.currentPos[0]--;
    }
    if(this.currentAction == "right"){
      if(neighborTiles[0] == currentTile + 1) this.height++;
      this.x += 32;
      this.y += 16*(this.height+1);
      this.currentPos[0]++;
    }
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

  reset(){
    this.currentAction = null;
  }
}