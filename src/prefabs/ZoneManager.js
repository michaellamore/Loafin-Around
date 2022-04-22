class ZoneManager{
  constructor(){
    this.zones = [];
    this.prevIndex = 1;
  }
  /* 
    TODO:
    - Add more zones to template
    - (if there's time) Add "speed up" zones that add points and let the player move up a space
    - (if there's time) Switch to a YAML format instead of JSON for better readability
  */


  create(){
    if(this.zones.length > 0) return console.error("Zones already exist");
    // If zones don't exist yet, create blank ones
    for(let zoneIndex = 1; zoneIndex <= 5; zoneIndex++){
      let currentZone = [];
      for(let digitIndex = 1; digitIndex <= 23; digitIndex++) currentZone.push(0);
      this.zones.push(currentZone);
    }
  }

  moveZones(){
    for(const zone of this.zones){
      zone.shift();
      // let prevNum = zone[zone.length - 1];
      // zone.push(this.generateNewNumber(prevNum));
    }
    // If there aren't enough zones, create new ones
    if(this.zones[0].length < 23) this.addObstaclesFromTemplate();
    this.zonesToConsole();
  }

  addObstaclesFromTemplate(){
    let randomIndex = Math.floor(Math.random() * numOfObstacles);
    // If it's the same index as before, get a new index
    if(randomIndex == this.prevIndex) return this.addObstaclesFromTemplate();
    this.prevIndex = randomIndex;

    let newZones = availableObstacles[randomIndex];
    for(let row = 0; row < newZones.length; row++){
      for(const digit of newZones[row]) this.zones[row].push(parseInt(digit));
    }
  }

  zonesToConsole(){
    let output = '';
    for(const zone of this.zones){
      let currentZone = '';
      for(const unit of zone) currentZone += unit;
      currentZone += '\n',
      output += currentZone;
    }
    console.log(output);
  }

  // Old function, no longer used
  generateNewNumber(prevNum){
    // For percentage chance
    let randomNum = Math.floor(Math.random() * 100);

    if(prevNum == 0){
      if (randomNum >= 90) return 1;
      if (randomNum >= 20) return 0;
      else return 2;
    }

    if (prevNum == 1){
      if (randomNum >= 90) return 1;
      if (randomNum >= 20) return 0;
      else return 0;
    }

    if (prevNum == 2){
      if (randomNum >= 70) return 0;
      if (randomNum >= 60) return 2;
      else return 1;
    }
    console.error("ZoneManager: Failed to generate new number.");
  }
}