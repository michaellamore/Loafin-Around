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
      for(let digitIndex = 1; digitIndex <= 23; digitIndex++) currentZone.push("0");
      this.zones.push(currentZone);
    }
  }

  moveZones(){
    for(const zone of this.zones) zone.shift();
    // If there aren't enough zones, create new ones
    if(this.zones[0].length < 23) this.addObstaclesFromYAML();
    // this.zonesToConsole();
  }

  addObstaclesFromYAML(){
    let key;
    if(templateObstacles["ObstacleTest"] != null){
      key = templateObstacles["ObstacleTest"]
    } 
    if(templateObstacles["ObstacleTest"] == null){
      const keys = Object.keys(templateObstacles);
      let randomKey =  keys[Math.floor(Math.random() * keys.length)];
      if(randomKey == "ObstacleTest" || randomKey == this.prevIndex) return this.addObstaclesFromYAML();
      this.prevKey = randomKey;
      key = randomKey;
    }
    let zone = templateObstacles[key];
    for(let row=0; row<zone.length; row++){
      let array = zone[row].split(", ");
      for(const element of array) this.zones[row].push(element);

      let randomTile = "0";
      if(Math.floor(Math.random()*10) == 1) randomTile = 'T';
      this.zones[row].push("0", randomTile);
    }
  }
  // Only outputs the first element for the zone
  zonesToConsole(){
    let output = '';
    for(const zone of this.zones){
      let currentZone = '';
      let currentAmount = 0;
      for(const unit of zone){
        currentAmount++;
        let firstElement = Array.from(unit)[0];
        if(currentAmount == 23) currentZone += '|';
        currentZone += firstElement;
      }
      currentZone += '\n',
      output += currentZone;
    }
    console.log(output);
  }
}