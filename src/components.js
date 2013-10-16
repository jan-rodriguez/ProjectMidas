/// The Grid component allows an element to be located
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
Crafty.c('Room1');
Crafty.c('Room2');
Crafty.c('Room3');
Crafty.c('Room4');
Crafty.c('Room5');
Crafty.c('Room6');


// Items
Crafty.c('Item', {
  init:function(){
    this.requires('Actor');		// get rid solid class so that onHit function works
  },
});

Crafty.c('Duck', {
	element:"duck",
	component: "duck_man_right",
  init:function(){
    this.requires('Item, duck');		// get rid solid class so that onHit function works
  }
});
Crafty.c('Dice', {
	element:"dice",
	component: "dice_man_left",
  init:function(){
    this.requires('Item, dice');		// get rid solid class so that onHit function works
  }
});
Crafty.c('Eraser', {
	element:"eraser",
	component: "eraser_man_left",
  init:function(){
    this.requires('Item, eraser');		// get rid solid class so that onHit function works
  }
});
Crafty.c('Clay', {
	element:"clay",
	component: "clay_man_left",
  init:function(){
    this.requires('Item, clay');		// get rid solid class so that onHit function works
  }
});
Crafty.c('Glass', {
	element:"glass",
	component: "glass_man_left",
  init:function(){
    this.requires('Item, glass');		// get rid solid class so that onHit function works
  }
});
//Enemies
Crafty.c('Enemy', {
  init:function(){
    this.requires('Actor, Tween,Collision')
    .attr({x: 0, y: 0});	
    this.onHit('Solid', this.hitSolid);// get rid solid class so that onHit function works
  },
  hitSolid:function(){
	  this.toggleComponent("Tween");
	  this.toggleComponent("Tween");
  },
  	

  //Method for enemies to take damage
  takeDamage:function(lost) {
  	this.health -= lost;
  	if (this.health < 0){
      this.kill()
    };

  },
  kill: function () {
	  this.destroy();
	  Crafty.trigger("EnemyDeath");
  },
  //Random moving around function for the enemies
  moveAround:function(){
    window.setInterval(function(enemy){
      var rand = Math.random();
      if(rand<.3){
        enemy.tween({x: enemy.x + 50}, 50);
      }else if(rand<.6){
        enemy.tween({x:enemy.x - 50}, 50);
      }
      rand = Math.random();
      if(rand <.3){
        enemy.tween({y: enemy.y + 50}, 50);
      }else if(rand <.6){
        enemy.tween({y:enemy.y - 50}, 50);
      }
    }, 1000, this);
  },    
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
Crafty.c('Wall', {
	  init: function() {
	    this.requires('Actor, Solid, tile_blue_brick');
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
    this.requires('Actor, door_closed,Solid')
    
  },
  doorOpen: function(){
	  if (this.has('door_closed')){
		  this.toggleComponent('door_closed, door_open, Solid');  
	  }

  }
});
//create the bullet component
Crafty.c("Bullet", {
	w: 32, h: 32, z:50, alpha: 1.0, x: 0, y: 0,
	element:"",
	attack: {"red": {"clay": 10, "dice": Math.round(Math.random()*80), "duck": 10, "eraser" : 20, "glass" : 10},
			"purple" : {"clay": 10, "dice": Math.round(Math.random()*80), "duck": 10, "eraser" : 20, "glass" : 10},
			"blue" : {"clay": 10, "dice": Math.round(Math.random()*800), "duck": 10, "eraser" : 20, "glass": 10},
	},
  

	init:function() {
		this.requires('Actor, bulletobject, 2D, DOM, Tween, Collision')
		.onHit('RedEnemy', this.shootRedEnemy)
		.onHit('PurpleEnemy', this.shootPurpleEnemy)
		.onHit('BlueEnemy', this.shootPurpleEnemy);		
  }
  ,
  bullet: function(dir){
  	if (dir == "e") {
  		this.tween({alpha: 0.0, x: this.x + 100, y: this.y}, 60);
  	}
  	else if (dir == "w"){this.tween({alpha: 0.0, x: this.x -100, y: this.y}, 60);}
  },
  shootRedEnemy: function(data){
  	redEnemy = data[0].obj;
  	redEnemy.takeDamage(this.attack["red"][this.element]);
  },
  shootPurpleEnemy: function(data){
  	purpleEnemy = data[0].obj;
  	purpleEnemy.takeDamage(this.attack["purple"][this.element]);
  },
  shootBlueEnemy: function(data){
  	blueEnemy = data[0].obj;
  	blueEnemy.takeDamage(this.attack["blue"][this.element]);
  },
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
  _health: 2000,
  element: "glass",
	component: "glass_man_right",
	attack: {
		"red": {"clay": 0, "dice": Math.round(Math.random()*50), "duck": 1, "glass" : 10},
		"blue": {"clay": 1, "dice": Math.round(Math.random()*50), "duck": 10, "glass" : 0},
		"purple": {"clay": 10, "dice": Math.round(Math.random()*50), "duck": 0, "glass" : 1},
	},
	getDamaged:{
		"red": {"clay": 25, "dice": Math.round(Math.random()*100), "duck": 10, "glass" : -10 },
		"blue": {"clay": 10, "dice": Math.round(Math.random()*100), "duck": -10, "glass" : 25},
		"purple": {"clay": -10, "dice": Math.round(Math.random()*100), "duck": 25, "glass" : 10},
	},
	facingRight: true,
	shoot: false,
  init: function(){
    this.requires('Actor, Fourway, Collision, Delay, glass_man_right, Keyboard, Stop')
    .fourway(4)

    .stopOnSolids()
    .onHit('Carpet', this.hitCarpet)
    .onHit('Lava2', this.hitLava2)
		.onHit('Enemy', function() {
			this.stopMovement;
		})
    //.onHit('Door', this.changeDoor)
    .onHit('RedEnemy', this.hitRedEnemy)
    .onHit('BlueEnemy', this.hitBlueEnemy)
    .onHit('PurpleEnemy', this.hitPurpleEnemy)
    //.delay(this.onHit, 1000, 'PurpleEnemy',  this.hitPurpleEnemy)

    .onHit('Item', this.hitItems)
    .bind("KeyDown", function(e) {
        if(e.keyCode === Crafty.keys.SPACE) {
            if(!this.shoot) {
                this.shoot = true;
                this.delay(function() {
                    this.shoot = false;
                }, 100);
                
                //this.stop();
                //Crafty.audio.play("Hit");             
                var bx, dir;
                if(this.facingRight) {
                    //this.sprite(5,2,1,2);
                    bx = this.x + 32;
                    dir = 'e';
                } else {
                    //this.sprite(5,0,1,2);
                    bx = this.x - 45;
                    dir = 'w';
                }
                Crafty.e("Bullet").attr({x: bx, y: this.y, element: this.element}).bullet(dir);
                var old = this.pos();
                this.trigger("change",old);
            }
        }
        if(e.keyCode === Crafty.keys.RIGHT_ARROW){
          this.facingRight = true;
          if(this.has('glass_man_left')){
            this.toggleComponent( 'glass_man_left', 'glass_man_right');
          }else if(this.has('dice_man_left')){
            this.toggleComponent( 'dice_man_left', 'dice_man_right');
          }else if(this.has('duck_man_left')){
            this.toggleComponent( 'duck_man_left', 'duck_man_right');
          }else if(this.has('eraser_man_left')){
            this.toggleComponent( 'eraser_man_left', 'eraser_man_right');
          }else if(this.has('clay_man_left')){
            this.toggleComponent( 'clay_man_left', 'clay_man_right');
          }
        } 
        if(e.keyCode === Crafty.keys.LEFT_ARROW){
          this.facingRight = false;
          if(this.has('glass_man_right')){
            this.toggleComponent( 'glass_man_right', 'glass_man_left');
          }else if(this.has('dice_man_right')){
            this.toggleComponent( 'dice_man_right', 'dice_man_left');
          }else if(this.has('duck_man_right')){
            this.toggleComponent( 'duck_man_right', 'duck_man_left');
          }else if(this.has('eraser_man_right')){
            this.toggleComponent( 'eraser_man_right', 'eraser_man_left');
          }else if(this.has('clay_man_right')){
            this.toggleComponent( 'clay_man_right', 'clay_man_left');
          }
        }
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
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

  hitLava2 : function(data) {
  	lava2 = data[0].obj;
  	lava2.addComponent('Solid');
  	this.destroy();
  	// Display game over here.
  },
  hitRedEnemy : function(data){
  	this.stopMovement;
    redEnemy = data[0].obj;
    if (this.element === "eraser") {redEnemy.kill(); }
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
  	// HIT SHARPY: if having duck element. game over. else takes damage depending on types
    PurpleEnemy = data[0].obj;
    if (this.element === "eraser") {PurpleEnemy.kill(); }
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
  	blueEnemy = data[0].obj;
    if (this.element === "eraser") {blueEnemy.kill(); }
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
  hitItems: function(data){
  	item = data[0].obj;
  	this.element = item.element;
  	this.toggleComponent(this.component, item.component);
  	this.component = item.component;
  	item.destroy();
  },

});