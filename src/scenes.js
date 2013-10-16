// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  Crafty.audio.play('Background_music_2', -1);
  //Paused variable to keep track of whether the game is paused or not
  var paused = false;
  this.atRoom = 1

  //ArrayList of all enemies
  var enemy_list = ['RedEnemy', 'BlueEnemy', 'PurpleEnemy'];

  //Running the background music for the game
  Crafty.audio.play('Background_music_2', -1);

  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    }
  }
 
  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e('PlayerCharacter').at(5, 16*6 -5);
  this.occupied[this.player.at().x][this.player.at().y] = true;
 Crafty.bind("BuildRoom",function(room_number){
  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y =((6-(room_number-1))*Game.map_grid.height/6.0); (y >= (6-room_number)*Game.map_grid.height/6.0) && (y <=((6-(room_number-1))*Game.map_grid.height/6.0)) ; y--) {
      var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1 ;
      var room_wall_top = (y ==16*1|| y ==16*2|| y ==16*3|| y ==16*4|| y ==16*5) && x!=12;
      var room_wall_bot = (y ==16*1-1|| y ==16*2-1|| y ==16*3-1|| y ==16*4-1|| y ==16*5-1) && x!=12;
      var at_carpet_top = (y ==(16*1) -1|| y ==(16*2)-1|| y ==(16*3)-1|| y ==(16*4)-1|| y ==(16*5)-1) && x==12;
      var at_carpet_bot = (y ==(16*1) || y ==(16*2)|| y ==(16*3)|| y ==(16*4)|| y ==(16*5)) && x==12;
      if(!this.occupied[x][y]){
    	  var room_num = 7 - Math.ceil((y+1)/16)
    	  var room = "Room" + String(room_num)
        if (at_edge|| room_wall_top ||room_wall_bot) {
          // Place a tree entity at the current tile
          Crafty.e('Wall',room).at(x, y);
          this.occupied[x][y] = true;
        }else if(Math.random() < .05 && x!=12){
          //Placing lava randomly on the level
          Crafty.e('Lava2',room).at(x,y);
          this.occupied[x][y] = true;
          
          
        }else if(Math.random() < .01 && x!=12){
          //Placing Duck randomly on the level
          Crafty.e('Duck',room).at(x,y);
          this.occupied[x][y] = true;    
        }else if(Math.random() < .01 && x!=12){
          //Placing CLay randomly on the level
          Crafty.e('Clay',room).at(x,y);
          this.occupied[x][y] = true; 
        }else if(Math.random() < .01 && x!=12){
          //Placing Glass randomly on the level
          Crafty.e('Glass',room).at(x,y);
          this.occupied[x][y] = true; 
       }else if(Math.random() < .005 && x!=12){
          //Placing Eraser randomly on the level
          Crafty.e('Eraser',room).at(x,y);
          this.occupied[x][y] = true;           
        }else if(Math.random() < .01 && x!=12){
          //Placing Dices randomly on the level
          Crafty.e('Dice',room).at(x,y);
          this.occupied[x][y] = true;             
          
        }else if(Math.random() < .05 && x!=12){
          //Placing random enemies in the level

          var enemy = enemy_list[Math.round(Math.random()*2)];
          var enemyObject = Crafty.e(enemy,room)
          enemyObject.at(x,y);
          enemyObject.moveAround();
          this.occupied[x][y] = true;
        }else if (at_carpet_top){
        	Crafty.e('TopCarpet',room).at(x,y);
        	this.occupied[x][y] = true
        }else if (at_carpet_bot){
        	Crafty.e('BottomCarpet',room).at(x,y);
        	Crafty.e('Door',room).at(x,y);
        	this.occupied[x][y] = true;
        	

        }
      }
    }
  }
 })

  //Pausing
  Crafty.bind('KeyDown', function(e){
    if(e.key == Crafty.keys['P']){
      //Starts music if pausing
      if(!paused){
    	x_spot= this.player._x;
    	y_spot = this.player._y;
        Crafty.audio.stop('Background_music_2');
        Crafty.audio.play('Background_music', -1);
        this.text = Crafty.e('2D, DOM, Text')
        .text('[SPACE] to begin')
        .attr({ x: x_spot, y: y_spot, h: 10, w: Game.width() })
        .css($text_css)
        .textColor('#ffd700')
        .textFont({size:'25px', weight: 'bold'});
        Crafty.viewport.centerOn(this.text)
        paused = true;
      }else{
        //Stops music when unpausing
        paused = false;
        Crafty.audio.play('Background_music_2', -1);
        Crafty.audio.stop('Background_music');
        this.text.destroy()
        Crafty.viewport.centerOn(this.player)
      }
      Crafty.pause();
      }
  })
    Crafty.bind("EnemyDeath",function(){
    		var room = "Room"+String(this.atRoom)
       		console.log(!Crafty("Enemy").length);
    		//Checks if there are no more enemies in room i (true if yes)
    		if (!Crafty(room+" Enemy").length){
    			if (room =="Room6"){
    				Crafty.trigger("GameWon")
    			}else{
    				Crafty(room+" Door").doorOpen()
    				this.atRoom += 1
    				Crafty.trigger("BuildRoom",this.atRoom)
    		}
    		}
    });
  Crafty.bind("GameWon",function(){
	  Crafty.scene("Victory");
  })
  Crafty.bind("PlayerDeath",function(){
	  console.log("respawn")
	  var y_spawn = 16*(7-(this.atRoom)) -5
	  console.log(y_spawn);
	  this.player = Crafty.e('PlayerCharacter').at(12, y_spawn)
  })
  Crafty.viewport.y = -16*32*5;
  Crafty.trigger("BuildRoom",1)
});

// Title Scene
//------------
Crafty.scene('Title', function(){
  Crafty.e('2D, DOM, Text')
    .text('MIDAS')
    .attr({ x: 0, y: 60, h: 10, w: Game.width() })
    .css($text_css)
    .textColor('#CCCCCC')
    .textFont({size:'150px', weight: 'bold'});

  Crafty.e('2D, DOM, Text')
    .text('[SPACE] to begin')
    .attr({ x: 0, y: 250, h: 10, w: Game.width() })
    .css($text_css)
    .textColor('#ffd700')
    .textFont({size:'25px', weight: 'bold'});

  Crafty.e('2D, DOM, Text')
    .text('[P] to pause')
    .attr({ x: 0, y: 300, h: 10, w: Game.width() })
    .css($text_css)
    .textColor('#ffd700')
    .textFont({size:'25px', weight: 'bold'});

  Crafty.e('2D, DOM, Text')
    .text('All sounds made by bfxer')
    .attr({ x: 0, y: Game.height() - 100, h: 10, w: Game.width() })
    .css($text_css)
    .textColor('#111111')
    .textFont({size:'20px', weight: 'italic'});

  Crafty.e('2D, DOM, Text')
    .text('Philip, Jan, Chau, Arturo, Justin, Pedro')
    .attr({ x: 0, y: Game.height() - 40, h: 10, w: Game.width() })
    .css($text_css)
    .textColor('#111111')
    .textFont({size:'20px', weight: 'italic'});

  title_bindings = function(e){
    if (e.key == Crafty.keys.SPACE){
      Crafty.unbind('KeyDown', title_bindings)
      Crafty.scene('Game');
    }
  }

  Crafty.bind('KeyDown', title_bindings);
});

Crafty.scene("Victory",function(){
	Crafty.e("2D, DOM, Text")
	.text("You have won")
	.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);
	})
	
// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);


  // Load our sprite map image
  Crafty.load(['assets/tiles/32x32-tiles_0.png'], function(){
    // Once the image is loaded...
 
    // Define the individual sprites in the image
    // Each one (spr_tree, etc.) becomes a component
    // These components' names are prefixed with "spr_"
    //  to remind us that they simply cause the entity
    //  to be drawn with a certain sprite
    Crafty.sprite(32, 'assets/tiles/32x32-tiles_0.png', {
      tile_water:             [0, 0],
      tile_blue_brick:        [1, 0],
      tile_blue_brick_2:      [0, 1],
      tile_lava:              [2, 0],
      tile_lava_2:            [2, 1],
      tile_wood:              [3, 0],
      tile_sm_brick_brown:    [4, 0],
      tile_lg_brick_brown:    [4, 1],
      tile_broken_brick_brown:[4, 2],
      tile_sm_brick_red:      [5, 0],
      tile_lg_brick_red:      [5, 1],
      //Giving the sprites a 1 pixel horizontal and vertiCal padding
    }, 2 , 2);

    // //Door sprites
    // Crafty.sprite(32, 'assets/tiles/doors.png', {
      // door_open: [0,0],
      // door_closed: [1,0],
    // });
// 
    // //Creating the enemies
    // Crafty.sprite(32, 'assets/char_sprites/red_block.png', {
      // red_enemy: [0,0],
    // });
    // Crafty.sprite(32, 'assets/char_sprites/purple_block.png',{
      // purple_enemy: [0,0],
    // });
    // Crafty.sprite(32, 'assets/char_sprites/yellow_block.png',{
      // yellow_enemy:[0,0],
    // });
    // //Load player sprite with a width of 22px and height of 32px
    // Crafty.sprite(22, 32, 'assets/char_sprites/glass_man.png', {
      // spr_player: [0, 0],
    // });

    //Door sprites
    Crafty.sprite(32, 'assets/tiles/doors.png', {
      door_open: [0,0],
      door_closed: [1,0],
    });

    //Creating the enemies
    Crafty.sprite(22, 32, 'assets/char_sprites/red_man.png', {
      red_enemy: [0,0],
    });
    Crafty.sprite(22, 32, 'assets/char_sprites/purple_man.png',{
      purple_enemy: [0,0],
    });
    // Crafty.sprite(32, 'assets/char_sprites/yellow_man.png',{
      // yellow_enemy:[0,0],
    // });

    Crafty.sprite(22, 32, 'assets/char_sprites/blue_man.png',{
      blue_enemy:[0,0],
    });

    //Loading all of the player animations
    Crafty.sprite(22, 30, 'assets/char_sprites/char_sprite_sheet.png', {
      glass_man_left: [0,0],
      glass_man_right: [1, 0],
      duck_man_left: [0, 1],
      duck_man_right: [1, 1],
      eraser_man_left: [0, 2],
      eraser_man_right: [1, 2],
      clay_man_left:[0, 3],
      clay_man_right: [1, 3],
      dice_man_left: [0,4],
      dice_man_right: [1, 4],
    }, 0, 0);

    Crafty.sprite(32, 'assets/char_sprites/glass.png', {
      glass: [0, 0],
    });
    
    // ducks
    Crafty.sprite(32, 'assets/char_sprites/duck.png',{
      duck:[0,0],
    });

    Crafty.sprite(32, 'assets/char_sprites/eraser.png',{
      eraser:[0,0],
    });
    
    // clays
    Crafty.sprite(32, 'assets/char_sprites/clay.png',{
      clay:[0,0],
    });
       
    // dices
		Crafty.sprite(32, 'assets/char_sprites/dice.png',{
      dice:[0,0],
    });
    
    // bullets
    Crafty.sprite(10, 'assets/char_sprites/red_block.png',{
      bulletobject:[0,0],
    });

    //Adding audio files
    Crafty.audio.add('Background_music', 'assets/music/snappy_lo.mp3');
    Crafty.audio.add('Background_music_2', 'assets/music/start_up_screen_loop.mp3');
    Crafty.audio.add('Glass_break', 'assets/sound_effects/glass_break.mp3');
    Crafty.audio.add('Hit', 'assets/sound_effects/hit.wav');
    Crafty.audio.add('Laser', 'assets/sound_effects/Laser_Shoot.wav');
    Crafty.audio.add('Powerup', 'assets/sound_effects/Powerup.wav');

 
    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Title');
  });
});

Crafty.scene('GameOver', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Congratulations, you fought your way past the clutches of the evil scientists and defeated all those who stood against you.')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);
});