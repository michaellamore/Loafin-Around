class ZoneManager{
  constructor(){
    this.zones = [];
    this.prevKey;
  }

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
    if(this.zones[0].length < 23) this.addObstaclesFromYAML();
    this.zonesToConsole();
  }

  addObstaclesFromYAML(){
    let zone;
    if(templateObstacles["ObstacleTest"] != null){
      let key = templateObstacles["ObstacleTest"]
      zone = templateObstacles[key];
    } 
    if(templateObstacles["ObstacleTest"] == null){
      const keys = Object.keys(templateObstacles);
      let randomKey =  keys[Math.floor(Math.random() * keys.length)];
      if(randomKey == "ObstacleTest" || randomKey == this.prevIndex) return this.addObstaclesFromYAML();
      this.prevKey = randomKey;
      zone = templateObstacles[randomKey];
    }
    for(let row=0; row<zone.length; row++){
      let array = zone[row].split(", ");
      for(const digit of array) this.zones[row].push(parseInt(digit));
      this.zones[row].push(0, 0, 0);
    }
  }

  zonesToConsole(){
    let output = '';
    for(const zone of this.zones){
      let currentZone = '';
      let currentAmount = 0;
      for(const unit of zone){
        currentAmount++;
        if(currentAmount == 23) currentZone += '|';
        currentZone += unit;
      }
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