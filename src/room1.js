// Create the room1
Crafty.scene('room1', function(){
	//Paused variable to keep track of whether the game is paused or not
	  var paused = false;

	  //ArrayList of all enemies
	  var enemy_list = [Crafty.e('RedEnemy'), Crafty.e('YellowEnemy'), Crafty.e('PurpleEnemy')];

	  //Running the background music for the game
	  Crafty.audio.play('Background_music_2', -1);
    // get the local storage item with key 'map' and see if it exists
    var room1 = $.parseJSON(localStorage.getItem('room1'));

    if ( room1 != undefined ) {

        createRoomFromStorage(room1);

        Crafty.e('2D, DOM, Text')
            .text('room1 loaded from local storage.')
            .attr({ x: -380, y: 700, w: Game.width() })
            .css($text_css);


        console.log('Loaded room1 from storage.');

    } else {

        createNewRoom();

        Crafty.e('2D, DOM, Text')
            .text('New room1 generated and stored in local storage.')
            .attr({ x: -350, y: 700, w: Game.width() })
            .css($text_css);

        console.log('Created new room1.');

    }

});

function createRoomFromStorage(room1) {

    for (var x = 0; x < room1.length; x++) {

        for ( var y = 0; y < room1[x].length; y++ ) {

            switch(room1[x][y])
            //We will have to have all the possible entities on this switch
            {
                case 'Border':
                    Crafty.e('Border').at(x, y);
                    break;
                case 'Bush':
                    Crafty.e('Bush').at(x, y);
                    break;
                case 'Rock':
                    Crafty.e('Rock').at(x, y);
                    break;
                case 'Player':
                    Crafty.e('PC').at(x, y);
                    break;
                default:

            }
        }
    }

};

function createNewRoom() {

	  // A 2D array to keep track of all occupied tiles
	  this.occupied = new Array(Game.map_grid.width);
	  for (var i = 0; i < Game.map_grid.width; i++) {
	    this.occupied[i] = new Array(Game.map_grid.height);
	    for (var y = 0; y < Game.map_grid.height; y++) {
	      this.occupied[i][y] = false;
	    }
	  }
	 
	  // Player character, placed at 5, 5 on our grid
	  if (this.player== undefined) {
		  this.player = Crafty.e('PlayerCharacter').at(5, 5);
		  this.occupied[this.player.at().x][this.player.at().y] = true;
	  }
	  // Place a tree at every edge square on our grid of 16x16 tiles
	  for (var x = 0; x < Game.map_grid.width; x++) {
	    for (var y = 0; y < Game.map_grid.height; y++) {
	      var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
	 
	      if (at_edge) {
	        // Place a tree entity at the current tile
	        Crafty.e('Wood').at(x, y);
	        this.occupied[x][y] = "Wood";
	      }else if(Math.random() < .05){
	        //Placing lava randomly on the level
	        Crafty.e('Lava2').at(x,y);
	        this.occupied[x][y] = "Lava2";
	      }else if(Math.random() < .05){
	        //Placing random enemies in the level
	        enemy_list[Math.round(Math.random()*2)].at(x,y);
	        this.occupied[x][y] = true
	      }
	    }
	  }
//
//	  //Pausing
//	  Crafty.bind('KeyDown', function(e){
//	    if(e.key == Crafty.keys['P']){
//	      //Starts music if pausing
//	      if(!paused){
//	        paused = true;
//	        Crafty.audio.stop('Background_music_2');
//	        Crafty.audio.play('Background_music', -1);
//	      }else{
//	        //Stops music when unpausing
//	        paused = false;
//	        Crafty.audio.play('Background_music_2', -1);
//	        Crafty.audio.stop('Background_music');
//	      }
//	      Crafty.pause();
//
//            }
//	  }
// 
    localStorage.setItem('room1', JSON.stringify(this.occupied));
    return this.occupied;

};
 