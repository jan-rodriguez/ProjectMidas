// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  //Paused variable to keep track of whether the game is paused or not
  var paused = false;

  //ArrayList of all enemies
  var enemy_list = ['RedEnemy', 'YellowEnemy', 'PurpleEnemy'];

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
  this.player = Crafty.e('PlayerCharacter').at(5, 5);
  this.occupied[this.player.at().x][this.player.at().y] = true;
 
  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
      if(!this.occupied[x][y]){
        if (at_edge) {
          // Place a tree entity at the current tile
          Crafty.e('Door').at(x, y);
          this.occupied[x][y] = true;
        }else if(Math.random() < .05){
          //Placing lava randomly on the level
          Crafty.e('Lava2').at(x,y);
          this.occupied[x][y] = true;
        }else if(Math.random() < .05){
          //Placing random enemies in the level
          enemy = enemy_list[Math.round(Math.random()*2)];
          Crafty.e(enemy).at(x,y);
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
  });

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

    //Door sprites
    Crafty.sprite(32, 'assets/tiles/doors.png', {
      door_open: [0,0],
      door_closed: [1,0],
    });

    //Creating the enemies
    Crafty.sprite(32, 'assets/char_sprites/red_block.png', {
      red_enemy: [0,0],
    });
    Crafty.sprite(32, 'assets/char_sprites/purple_block.png',{
      purple_enemy: [0,0],
    });
    Crafty.sprite(32, 'assets/char_sprites/yellow_block.png',{
      yellow_enemy:[0,0],
    });
    //Load player sprite with a width of 22px and height of 32px
    Crafty.sprite(22, 32, 'assets/char_sprites/glass_man.png', {
      spr_player: [0, 0],
    });


    //Adding audio files
    Crafty.audio.add('Background_music', 'assets/music/snappy_lo.mp3');
    Crafty.audio.add('Background_music_2', 'assets/music/start_up_screen_loop.mp3');
    Crafty.audio.add('Glass_break', 'assets/sound_effects/glass_break.mp3');

 
    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  });
});