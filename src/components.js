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



Crafty.c('PlayerCharacter', {
  init: function(){
    this.requires('Actor, Fourway, Collision, spr_player')
    .fourway(4)
    .stopOnSolids();
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
});