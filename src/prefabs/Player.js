class Player extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y, texture, frame, speed, zones){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCircle(4, 28, 42); 
    this.setImmovable();
    this.scene = scene;
    this.zones = zones;
    this.currentPos = [2, 7]; // Row (0-4), Column (0-22)
    this.target = new Phaser.Math.Vector2(this.x, this.y);
    this.elevation = 0;
    this.movespeed = speed;
    this.currentAction = "forward";
    this.isIdle = true;
    this.isDead = false;
  }

  getInput(){
    if(Phaser.Input.Keyboard.JustDown(keyLeft) && this.currentPos[0] > 0) this.currentAction = "left";
    if(Phaser.Input.Keyboard.JustDown(keyRight) && this.currentPos[0] < 4) this.currentAction = "right";
    if(Phaser.Input.Keyboard.JustDown(keyUp) && this.isIdle) this.currentAction = "jump";
    if(Phaser.Input.Keyboard.JustDown(keyDown) && this.isIdle) this.currentAction = "slide";
  }
  // This is basically my attempt at a custom collision system based on the zone manager. Very scuffed indeed
  checkMovement(){
    this.checkOutOfBounds();

    // Movement depends on surrounding tiles, current tile, and player input
    let neighborTiles = this.getSurroundingTiles();

    if(this.currentAction == "jump" && this.isIdle){
      this.elevation++;
      this.isIdle = false;
      this.anims.play('jump');
      if(neighborTiles[2] > this.elevation){
        this.currentPos[1]--;
        this.scene.sound.play('sfx_blocked');
      }
    }

    if(this.currentAction == "slide" && this.isIdle){
      this.isIdle = false;
      this.anims.play('slide');
      if(neighborTiles[2] > this.elevation){
        this.currentPos[1]--;
        this.scene.sound.play('sfx_blocked');
      }
    }

    // Moving will change the row and column of the player
    if(this.currentAction == "left"){
      // If far left tile is greater, or if front AND close left tile is greater, or it's a slide obstacle, it can't move left
      if(neighborTiles[1] > this.elevation || neighborTiles[1] == "S" ||
        (neighborTiles[2] >  this.elevation && neighborTiles[0] > this.elevation)){
        this.currentAction = "forward";
        this.scene.sound.play('sfx_blocked');
      } else {
        if(this.calculateElevation(neighborTiles[1]) == this.elevation) this.isIdle = true;
        this.elevation = this.calculateElevation(neighborTiles[1]);
        this.currentPos[0]--;
        this.anims.play('rotateLeft');
      }
    }
    if(this.currentAction == "right"){
      if(neighborTiles[3] >  this.elevation || neighborTiles[3] == "S" ||
        (neighborTiles[2] >  this.elevation && neighborTiles[4] > this.elevation)){
        this.currentAction = "forward"; 
        this.scene.sound.play('sfx_blocked');
      } else {
        if(this.calculateElevation(neighborTiles[3]) == this.elevation) this.isIdle = true;
        this.elevation = this.calculateElevation(neighborTiles[3]);
        this.currentPos[0]++;
        this.anims.play('rotateRight');
      }
    }
    if(this.currentAction == "forward"){
      if(neighborTiles[2] > this.elevation || neighborTiles[2] == "S"){
        this.currentPos[1]--;
        this.elevation = this.calculateElevation(neighborTiles[5]);
        this.scene.sound.play('sfx_blocked');
      } else {
        this.elevation = this.calculateElevation(neighborTiles[2]);
        this.anims.play('rotateForward'); 
      }
    }
    if(neighborTiles[5] == "H" && this.elevation == 0){ this.isDead = true; } // Homie landed on a death pit

    // After changing the row/column of player, convert it into game coordinates
    if(this.calculateElevation(neighborTiles[2]) == this.elevation) this.isIdle = true;
    let coords = this.gridToCoords();
    this.target.x = coords[0]
    this.target.y = coords[1] - (32*this.elevation);
    this.setDepth(this.calculateDepth() + (this.elevation*5));
    this.reset();
  }

  move(delta){
    let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
    if (distance <= 8) { // When close enough, just snap into place
      this.x = this.target.x;
      this.y = this.target.y;
    } else { // Move towards target
      let multiplier = 2;
      if(this.elevation >= 2) multiplier++;
      if(this.y < this.target.y) this.y += this.movespeed*multiplier*delta;
      if(this.y > this.target.y) this.y -= this.movespeed*multiplier*delta;
      if(this.x > this.target.x) this.x -= this.movespeed*2*delta;
      if(this.x < this.target.x) this.x += this.movespeed*2*delta;
    }
  } 

  // Outputs an array of 6 elements: close left, far left, in front, far right, close right, and current
  getSurroundingTiles(){
    let output = [];
    let row = this.currentPos[0];
    let column = this.currentPos[1];
    // close left
    if(row <= 0) output.push("0");
    if(row > 0) output.push(Array.from(this.zones[row - 1][column])[0]);
    // far left
    if(row <= 0) output.push("0");
    if(row > 0) output.push(Array.from(this.zones[row - 1][column+1])[0]);
    // In front
    output.push(Array.from(this.zones[row][column + 1])[0]);
    // far right
    if(row >= 4) output.push("0");
    if (row < 4) output.push(Array.from(this.zones[row + 1][column+1])[0]);
    // close right
    if(row >= 4) output.push("0");
    if (row < 4) output.push(Array.from(this.zones[row + 1][column])[0]);
    // center
    output.push(Array.from(this.zones[row][column])[0]);
    return output;
  }

  reset(){ 
    this.currentAction = "forward";
    
  }

  speedup(){
    this.currentPos[1]++;
    let neighborTiles = this.getSurroundingTiles();
    this.elevation = this.calculateElevation(neighborTiles[2]);
    let coords = this.gridToCoords();
    this.target.x = coords[0];
    this.target.y = coords[1] - (32*this.elevation);
    this.setDepth(this.calculateDepth() + (this.elevation*5));
    this.anims.play('rotateForward');
  }

  calculateElevation(tile){
    if(tile == 0 || tile == 1 || tile == 2) return parseInt(tile);
    if(tile == "J" || tile == "B" || tile == "H") return 0;
    if(tile == "S") return 2;
  }

  checkOutOfBounds(){
    // If the player's column reaches the red zones, DIE
    if(this.currentPos[1] <= 1 || this.currentPos[1] >= 19) this.isDead = true;

    // If player's row somehow becomes out of range, set it back down to the limits
    if(this.currentPos[0] < 0) this.currentPos[0] = 0;
    if(this.currentPos[0] > 4) this.currentPos[0] = 4;
  }

  // Based on position of player on a grid, convert it into x-y positions
  gridToCoords(){
    let row = this.currentPos[0];
    let column = this.currentPos[1];
    // These are the coordinates for the very first row/column, 0-0
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