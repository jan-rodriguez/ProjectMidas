// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  //Paused variable to keep track of whether the game is paused or not
  var paused = false;

  //ArrayList of all enemies
  var enemy_list = ['RedEnemy', 'BlueEnemy', 'PurpleEnemy'];

  //Running the background music for the game
  // Crafty.audio.play('Background_music_2', -1);

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
 
  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
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
        	Crafty.e('Door',room).at(x,y);
        	this.occupied[x][y] = true
        }else if (at_carpet_bot){
        	Crafty.e('BottomCarpet',room).at(x,y);
        	Crafty.e('Door',room).at(x,y);
        	this.occupied[x][y] = true;

        }
      }
    }
  }

  //Pausing
  Crafty.bind('KeyDown', function(e){
    if(e.key == Crafty.keys['P']){
      //Starts music if pausing
      if(!paused){
        paused = true;
        Crafty.audio.stop('Background_music_2');
        Crafty.audio.play('Background_music', -1);
      }else{
        //Stops music when unpausing
        paused = false;
        Crafty.audio.play('Background_music_2', -1);
        Crafty.audio.stop('Background_music');
      }
      Crafty.pause();
      }
  })
    Crafty.bind("EnemyDeath",function(){
    	for (var i = 1; i <7;i++){
    		var room = "Room"+String(i)
    		//Checks if there are no more enemies in room i (true if yes)
    		if (!Crafty(room,"Enemy").length){
    			Crafty(room,"Door")
    		}
    	}
  });
  Crafty.viewport.y = -16*32*5;
});

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
      //Giving the sprites a 1 pixel horizontal and vertival padding
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
    Crafty.sprite(32, 'assets/char_sprites/red_man.png', {
      red_enemy: [0,0],
    });
    Crafty.sprite(32, 'assets/char_sprites/purple_man.png',{
      purple_enemy: [0,0],
    });
    // Crafty.sprite(32, 'assets/char_sprites/yellow_man.png',{
      // yellow_enemy:[0,0],
    // });

    Crafty.sprite(32, 'assets/char_sprites/blue_man.png',{
      blue_enemy:[0,0],
    });
    //Load player sprite with a width of 22px and height of 32px
    Crafty.sprite(22, 32, 'assets/char_sprites/glass_man.png', {
      spr_player: [0, 0],
    });
    Crafty.sprite(32, 'assets/char_sprites/glass.png', {
      glass: [0, 0],
    });
    
    // ducks
    Crafty.sprite(32, 'assets/char_sprites/duck.png',{
      duck:[0,0],
    });
    Crafty.sprite(32, 'assets/char_sprites/duck_man.png',{
      duck_man:[0,0],
    });
    // erasers
    Crafty.sprite(32, 'assets/char_sprites/eraser_man.png',{
      eraser_man:[0,0],
    });
    Crafty.sprite(32, 'assets/char_sprites/eraser.png',{
      eraser:[0,0],
    });
    
    // clays
    Crafty.sprite(32, 'assets/char_sprites/clay_man.png',{
      clay_man:[0,0],
    });
    Crafty.sprite(32, 'assets/char_sprites/clay.png',{
      clay:[0,0],
    });
       
    // dices
		Crafty.sprite(32, 'assets/char_sprites/dice_man.png',{
      dice_man:[0,0],
    });
		Crafty.sprite(32, 'assets/char_sprites/dice.png',{
      dice:[0,0],
    });
    
    // bullets
    Crafty.sprite(32, 'assets/char_sprites/bulletobject.png',{
      bulletobject:[0,0],
    });

    //Adding audio files
    Crafty.audio.add('Background_music', 'assets/music/snappy_lo.mp3');
    Crafty.audio.add('Background_music_2', 'assets/music/start_up_screen_loop.mp3');
    Crafty.audio.add('Glass_break', 'assets/sound_effects/glass_break.mp3');
    Crafty.audio.add('Hit', 'assets/sound_effects/hit.mp3');

 
    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  });
});