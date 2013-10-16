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



// Items
Crafty.c('Item', {
  init:function(){
    this.requires('Actor');		// get rid solid class so that onHit function works
  },
});

Crafty.c('Duck', {
	element:"duck",
	component: "duck_man",
  init:function(){
    this.requires('Item, duck');		// get rid solid class so that onHit function works
  }
});

Crafty.c('Dice', {
	element:"dice",
	component: "dice_man",
  init:function(){
    this.requires('Item, dice');		// get rid solid class so that onHit function works
  }
});

Crafty.c('Eraser', {
	element:"eraser",
	component: "eraser_man",
  init:function(){
    this.requires('Item, eraser');		// get rid solid class so that onHit function works
  }
});

Crafty.c('Clay', {
	element:"clay",
	component: "clay_man",
  init:function(){
    this.requires('Item, clay');		// get rid solid class so that onHit function works
  }
});

Crafty.c('Glass', {
	element:"glass",
	component: "spr_player",
  init:function(){
    this.requires('Item, glass');		// get rid solid class so that onHit function works
  }
});

//Enemies
Crafty.c('Enemy', {
  init:function(){
    this.requires('Actor');		// get rid solid class so that onHit function works
  },
  takeDamage:function(lost) {
  	console.log(this.health);
  	this.health -= lost;
  	console.log(this.health);
  	if (this.health < 0) this.destroy();
  }  
});

Crafty.c('RedEnemy', {
	health: 2000,
  init:function(){
    this.requires('Enemy, red_enemy')
  },
});

Crafty.c('PurpleEnemy', {
	health: 2000,
  init:function(){
    this.requires('Enemy, purple_enemy');
  },
});

Crafty.c('BlueEnemy', {
	health: 2000,
	damages: {"duck": 100},
  init:function(){
    this.requires('Enemy, blue_enemy');
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
    this.requires('Actor, tile_lava_2');  // get rid of Solid so that onHit function could work
  },
});

//Creating door that the player will walk through to get to different levels
Crafty.c('Door', {
  init: function(){
    this.requires('Actor, door_open');
  },
});


// Crafty.c('Wood', {
  // init:function(){
    // this.requires('Actor, tile_wood');
  // },
  // hitPlayer: function(){
    // console.log("ow");
    // Crafty.scene('Game');
  // },
// })

//create the bullet component
Crafty.c("bullet", {
	init:function() {
		this.requires("tile_wood")	
	},
    bullet: function(dir) {
        this.bind("enterframe", function() {
            this.move(dir, 15);
            if(this.x > Crafty.viewport.width || this.x < 0) 
                this.destroy();
        });
        return this;
    }
});

Crafty.c('Carpet', {
	  init:function(){
	    this.requires('Actor, tile_wood');
	    this.z = -1; 
	  },
		hitPlayer: function(){
			console.log("ow");
		  },

	});
Crafty.c('TopCarpet', {
	init:function(){
		this.requires("Carpet");
		this.hitPlayer =  function(){
			console.log("banana");
			Crafty.viewport.follow(this,0,(16*15));
	  }
	},
});

Crafty.c('BottomCarpet', {
	init:function(){
		this.requires("Carpet");
		this.hitPlayer= function(){
			console.log("ow");
			Crafty.viewport.follow(this,0,(-16*15));
		}
	},
})

// Player
Crafty.c('PlayerCharacter', {
  //Health for the player
  _health: 1000,
  element: "glass",
	component: "spr_player",
	attack: {
		"red": {"glass" : 150,},
		"blue": {"glass" : 0,},
		"purple": {"glass" : 50,},
	},
	getDamaged:{
		"red": {"glass" : 50,},
		"blue": {"glass" : 0,},
		"purple": {"glass" : 20,},
	},
	facingRight: true,
	shoot: false,
  init: function(){
    this.requires('Actor, Fourway, Collision, Delay, spr_player, Keyboard, Stop')
    .fourway(4)
    .stopOnSolids()
    .onHit('Carpet', this.hitCarpet)
    .onHit('Door', this.changeDoor)
    .onHit('Lava2', this.hitLava2)
		.onHit('Enemy', function() {
			this.stopMovement;
		})
    .onHit('Door', this.changeDoor)
    .onHit('RedEnemy', this.hitRedEnemy)
    .onHit('BlueEnemy', this.hitBlueEnemy)
    .onHit('PurpleEnemy', this.hitPurpleEnemy)
    //.delay(this.onHit, 1000, 'PurpleEnemy',  this.hitPurpleEnemy)

    .onHit('Item', this.hitItems)
    .bind("KeyDown", function(e) {
        if(e.keyCode === Crafty.keys.SPACE) {
        	  console.log("Detect a space bar here");
            if(!this.shoot) {
                this.shoot = true;
                this.delay(function() {
                    this.shoot = false;
                }, 100);
                
                //this.stop();
                // Crafty.audio.play("shoot");             
                var bx, dir;
                if(this.facingRight) {
                    //this.sprite(5,2,1,2);
                    bx = this.x + 32;
                    dir = 'e';
                } else {
                    //this.sprite(5,0,1,2);
                    bx = this.x - 5;
                    dir = 'w';
                }
                
                Crafty.e("2D, DOM, color, bullet").attr({x: bx, y: this.y + 31, w: 5, h: 2, z:50}).bullet(dir);
                // var old = this.pos();
                // this.trigger("change",old);

            }
        }
        if(e.keyCode === Crafty.keys.RIGHT_ARROW) this.facingRight = true;
        if(e.keyCode === Crafty.keys.LEFT_ARROW) this.facingRight = false;
    })
        this.z = 20;
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
      this.x -= 2*this._movement.x;
      this.y -= 2*this._movement.y;
    }
  },

  hitLava2 : function(data) {
  	console.log("hit lava 2");
  	lava2 = data[0].obj;
  	lava2.addComponent('Solid');
  	this.destroy();
  	// Display game over here.
  },

  hitRedEnemy : function(data){
  	this.stopMovement;
  	console.log("His enemy in hitRedEnemy");
    redEnemy = data[0].obj;
    console.log(this.getDamaged["red"][this.element]);
    if (this.element === "eraser") {redEnemy.destroy(); }
    else {
    	if (this.element === "clay") { this.destroy() }
    	else {
		    this.health -= this.getDamaged["red"][this.element];
		    if (this.health < 0) { this.destroy();}
		    redEnemy.takeDamage(this.attack["red"][this.element]);    		
    	}
    }
  },

  hitPurpleEnemy : function(data){
  	this.stopMovement;
  	// var delay = Crafty.e('Delay');
  	// delay.delay()

  	// HIT SHARPY: if having duck element. game over. else takes damage depending on types
  	console.log("His enemy in hitPurpleEnemy");
    PurpleEnemy = data[0].obj;
    if (this.element === "eraser") {PurpleEnemy.destroy(); }
    else {
    	if (this.element === "duck") { this.destroy() }
    	else {
		    this.health -= this.getDamaged["purple"][this.element];
		    if (this.health < 0) { this.destroy();}
		    PurpleEnemy.takeDamage(this.attack["purple"][this.element]);    		
    	}
    }
  },
  hitBlueEnemy: function(data){
  	this.stopMovement;
  	// hit ELECTRICITY: if having glass element, game over. else takes damage depending on types
  	console.log("His enemy in hitPurpleEnemy");
  	blueEnemy = data[0].obj;
    if (this.element === "eraser") {blueEnemy.destroy(); }
    else {
    	if (this.element === "glass") { this.destroy() }
    	else {
		    this.health -= this.getDamaged["blue"][this.element];
		    if (this.health < 0) { this.destroy();}
		    blueEnemy.takeDamage(this.attack["blue"][this.element]);    		
    	}
    }

  },

  hitCarpet : function(data){
    Carpet = data[0].obj;
    Carpet.hitPlayer();
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
  hitByEnemy: function(data){
    this.destroy();
  },

  hitItems: function(data){
  	console.log("Hit some items");
  	item = data[0].obj;
  	this.element = item.element;
  	this.toggleComponent(this.component, item.component);
  	this.component = item.component;
  	//console.log(this.element);
  	console.log(this.component);
  	item.destroy();
  },

  changeDoor: function(data){
  	console.log("Display hit door")
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