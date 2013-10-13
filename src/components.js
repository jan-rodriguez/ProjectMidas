// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },
 
  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});

//Enemies
Crafty.c('Enemy', {
  init:function(){
    this.requires('Actor, Solid');
  },
});

Crafty.c('RedEnemy', {
  init:function(){
    this.requires('Enemy, red_enemy');
  },
});

Crafty.c('YellowEnemy', {
  init:function(){
    this.requires('Enemy, yellow_enemy');
  },
});

Crafty.c('PurpleEnemy', {
  init:function(){
    this.requires('Enemy, purple_enemy');
  },
});

//Simple water tile
Crafty.c('Water', {
  init: function() {
    this.requires('Actor, Solid, tile_water');
  },
});

//Simple lava tile
Crafty.c('Lava', {
  init: function() {
    this.requires('Actor, Solid, tile_lava');
  },
 
});

//Slightly different lava tile to keep the level from looking bland
Crafty.c('Lava2', {
  init: function() {
    this.requires('Actor, Solid, tile_lava_2');
  },
});

//Creating door that the player will walk through to get to different levels
Crafty.c('Door', {
  init: function(){
    this.requires('Actor, door_open');
  },
});

Crafty.c('Wood', {
  init:function(){
    this.requires('Actor, tile_wood');
  },
  hitPlayer: function(){
    console.log("ow");
    Crafty.scene('Game');
  },
})

Crafty.c('PlayerCharacter', {
  //Health for the player
  _health: 100,

  init: function(){
    this.requires('Actor, Fourway, Collision, spr_player')
    .fourway(4)
    .stopOnSolids()
    .onHit('Wood', this.hitWood)
    .onHit('Door', this.changeDoor);
  },

  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
    return this;
  },
 
  // Stops the movement
  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },
  hitWood : function(data){
    wood = data[0].obj;
    wood.hitPlayer();
    this.destroy();
  },
  changeDoor: function(data){
    door = data[0].obj;
    //If door is open
    if(door.has('door_open')){
      //door will now appear closed
      door.toggleComponent('door_closed, door_open');
      //Door will be a solid, that the player cannot pass through
      door.addComponent('Solid');
    }
  },
});